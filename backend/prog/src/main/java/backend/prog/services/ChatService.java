package backend.prog.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import backend.prog.dto.ChatMessageResponse;
import backend.prog.dto.ChatSessionResponse;
import backend.prog.dto.CreateChatSessionRequest;
import backend.prog.entity.ChatMessage;
import backend.prog.entity.ChatSession;
import backend.prog.entity.IndexStatus;
import backend.prog.entity.MessageRole;
import backend.prog.entity.Repository;
import backend.prog.exceptions.BadRequestException;
import backend.prog.exceptions.NotFoundException;
import backend.prog.repository.ChatMessageRepository;
import backend.prog.repository.ChatSessionRepository;
import backend.prog.services.ai.ChatPromptBuilder;
import backend.prog.services.ai.ChatStreamHandler;
import backend.prog.services.ai.CitationMapper;
import backend.prog.services.ai.CodeContextRetriever;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RepoService repoService;
    private final CodeContextRetriever codeContextRetriever;
    private final ChatPromptBuilder chatPromptBuilder;
    private final ChatStreamHandler chatStreamHandler;
    private final CitationMapper citationMapper;

    public ChatSessionResponse createSession(
            UUID userId,
            CreateChatSessionRequest request) {

        Repository repo = repoService.requireOwned(
                request.repositoryId(),
                userId
        );

        if (repo.getIndexStatus() != IndexStatus.READY) {
            throw new BadRequestException(
                    "Repository must be indexed before chatting"
            );
        }

        String title =
                request.title() != null &&
                !request.title().isBlank()
                        ? request.title().trim()
                        : "New Chat";

        ChatSession session = ChatSession.builder()
                .userId(userId)
                .repositoryId(repo.getId())
                .title(title)
                .build();

        session = chatSessionRepository.save(session);

        return toSessionResponse(session);
    }

    @Transactional(readOnly = true)
    public List<ChatSessionResponse> listSessions(
            UUID userId,
            UUID repositoryId) {

        repoService.requireOwned(
                repositoryId,
                userId
        );

        return chatSessionRepository
                .findByUserIdAndRepositoryIdOrderByCreatedAtDesc(
                        userId,
                        repositoryId
                )
                .stream()
                .map(this::toSessionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(
            UUID userId,
            UUID sessionId) {

        ChatSession session =
                requireSession(userId, sessionId);

        return chatMessageRepository
                .findBySessionIdOrderByCreatedAtAsc(
                        session.getId()
                )
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ChatSession requireSession(
            UUID userId,
            UUID sessionId) {

        return chatSessionRepository
                .findByIdAndUserId(
                        sessionId,
                        userId
                )
                .orElseThrow(() ->
                        new NotFoundException(
                                "Chat session not found"
                        )
                );
    }

    /*
     * ============================================================
     * RENAME SESSION
     * ============================================================
     */

    @Transactional
    public ChatSessionResponse renameSession(
            UUID userId,
            UUID sessionId,
            String title) {

        ChatSession session =
                requireSession(userId, sessionId);

        String cleanedTitle =
                title == null
                        ? ""
                        : title.trim();

        if (cleanedTitle.isBlank()) {
            throw new BadRequestException(
                    "Chat title cannot be empty"
            );
        }

        if (cleanedTitle.length() > 200) {
            cleanedTitle =
                    cleanedTitle.substring(0, 200);
        }

        session.setTitle(cleanedTitle);

        session =
                chatSessionRepository.save(session);

        return toSessionResponse(session);
    }

    /*
     * ============================================================
     * DELETE SESSION
     * ============================================================
     */

    @Transactional
    public void deleteSession(
            UUID userId,
            UUID sessionId) {

        ChatSession session =
                requireSession(userId, sessionId);

        /*
         * Delete the messages first because they belong
         * to this session.
         */
        chatMessageRepository.deleteBySessionId(
                session.getId()
        );

        chatSessionRepository.delete(session);
    }

    /*
     * ============================================================
     * STREAM CHAT
     * ============================================================
     */

    public SseEmitter streamReply(
            UUID userId,
            UUID sessionId,
            String userContent) {

        ChatSession session =
                requireSession(
                        userId,
                        sessionId
                );

        Repository repo =
                repoService.requireOwned(
                        session.getRepositoryId(),
                        userId
                );

        if (repo.getIndexStatus() != IndexStatus.READY) {
            throw new BadRequestException(
                    "Repository is not ready for chat"
            );
        }

        /*
         * Automatically name a brand-new chat after
         * the first user question.
         */
        boolean firstMessage =
                chatMessageRepository
                        .findBySessionIdOrderByCreatedAtAsc(
                                session.getId()
                        )
                        .isEmpty();

        if (
                firstMessage &&
                isDefaultTitle(session.getTitle())
        ) {
            session.setTitle(
                    generateChatTitle(userContent)
            );

            chatSessionRepository.save(session);
        }

        /*
         * Persist user's message.
         */
        ChatMessage userMessage =
                chatMessageRepository.save(
                        ChatMessage.builder()
                                .sessionId(
                                        session.getId()
                                )
                                .role(MessageRole.USER)
                                .content(userContent)
                                .build()
                );

        /*
         * RAG retrieval.
         */
        var retrievedContext =
                codeContextRetriever.retrieve(
                        repo.getId(),
                        userContent
                );

        /*
         * Build prompts.
         */
        String systemPrompt =
                chatPromptBuilder.systemPrompt(
                        repo.getFullName()
                );

        String userPrompt =
                chatPromptBuilder.userPrompt(
                        retrievedContext.contextText(),
                        userContent
                );

        /*
         * Stream Gemini response.
         */
        return chatStreamHandler.stream(
                session.getId(),
                toMessageResponse(userMessage),
                retrievedContext.citations(),
                systemPrompt,
                userPrompt
        );
    }

    /*
     * ============================================================
     * CHAT TITLE GENERATION
     * ============================================================
     */

    private boolean isDefaultTitle(
            String title) {

        if (title == null) {
            return true;
        }

        return title.equalsIgnoreCase("New Chat")
                || title.equalsIgnoreCase("New chat");
    }

    private String generateChatTitle(
            String content) {

        if (content == null) {
            return "New Chat";
        }

        String cleaned =
                content.trim();

        if (cleaned.isBlank()) {
            return "New Chat";
        }

        /*
         * Split by whitespace.
         */
        String[] words =
                cleaned.split("\\s+");

        StringBuilder title =
                new StringBuilder();

        int count =
                Math.min(words.length, 2);

        for (int i = 0; i < count; i++) {

            String word =
                    cleanWord(words[i]);

            if (word.isBlank()) {
                continue;
            }

            if (title.length() > 0) {
                title.append(" ");
            }

            title.append(word);
        }

        if (title.length() == 0) {
            return "New Chat";
        }

        String result =
                title.toString();

        if (result.length() > 200) {
            result =
                    result.substring(0, 200);
        }

        return result;
    }

    private String cleanWord(
            String word) {

        /*
         * Removes punctuation from the beginning
         * and end while keeping useful characters
         * inside the word.
         *
         * Example:
         *
         * "What"      -> What
         * "project?"  -> project
         * "`Main.java`" -> Main.java
         */
        return word
                .replaceAll(
                        "^[^\\p{L}\\p{N}`]+",
                        ""
                )
                .replaceAll(
                        "[^\\p{L}\\p{N}.`]+$",
                        ""
                )
                .replace("`", "");
    }

    /*
     * ============================================================
     * DTO MAPPING
     * ============================================================
     */

    private ChatSessionResponse toSessionResponse(
            ChatSession session) {

        return new ChatSessionResponse(
                session.getId(),
                session.getRepositoryId(),
                session.getTitle(),
                session.getCreatedAt()
        );
    }

    private ChatMessageResponse toMessageResponse(
            ChatMessage message) {

        return new ChatMessageResponse(
                message.getId(),
                message.getRole(),
                message.getContent(),
                citationMapper.fromJson(
                        message.getCitations()
                ),
                message.getCreatedAt()
        );
    }
}