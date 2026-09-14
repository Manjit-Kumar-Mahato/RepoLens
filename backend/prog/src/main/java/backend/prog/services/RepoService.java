package backend.prog.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.prog.dto.IndexStatusResponse;
import backend.prog.dto.RepositoryResponse;
import backend.prog.entity.IndexStatus;
import backend.prog.entity.Repository;
import backend.prog.entity.User;
import backend.prog.exceptions.NotFoundException;
import backend.prog.repository.RepositoryRepository;
import backend.prog.services.Github.GithubApiClient;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RepoService {

    private final RepositoryRepository repositoryRepository;

    private final UserService userService;

    private final GithubApiClient githubApiClient;

    @Transactional
    public List<RepositoryResponse> syncAndListRepo(
            UUID userId
    ) {

        User user =
                userService.requiredById(userId);

        String token =
                userService.decryptAccessToken(user);

        List<Map<String, Object>> remoteRepos =
                githubApiClient.listUserRepos(token);

        List<Repository> saved =
                new ArrayList<>();

        for (Map<String, Object> remote : remoteRepos) {

            Long githubRepoId =
                    toLong(remote.get("id"));

            Repository repo =
                    repositoryRepository
                            .findByUserIdAndGithubRepoId(
                                    userId,
                                    githubRepoId
                            )
                            .orElseGet(
                                    Repository::new
                            );

            boolean existing =
                    repo.getId() != null;

            String fullName =
                    String.valueOf(
                            remote.get("full_name")
                    );

            String[] parts =
                    fullName.split("/", 2);

            /*
             * Basic repository information
             */
            repo.setUserId(userId);

            repo.setGithubRepoId(
                    githubRepoId
            );

            repo.setOwner(
                    parts.length > 0
                            ? parts[0]
                            : String.valueOf(
                                    remote.get("name")
                            )
            );

            repo.setName(
                    parts.length > 1
                            ? parts[1]
                            : String.valueOf(
                                    remote.get("name")
                            )
            );

            repo.setFullName(fullName);

            repo.setPrivate(
                    Boolean.TRUE.equals(
                            remote.get("private")
                    )
            );

            repo.setDefaultBranch(
                    remote.get("default_branch") != null
                            ? String.valueOf(
                                    remote.get(
                                            "default_branch"
                                    )
                            )
                            : "main"
            );

            repo.setLanguage(
                    remote.get("language") != null
                            ? String.valueOf(
                                    remote.get("language")
                            )
                            : null
            );

            repo.setHtmlUrl(
                    remote.get("html_url") != null
                            ? String.valueOf(
                                    remote.get("html_url")
                            )
                            : null
            );

            repo.setDescription(
                    remote.get("description") != null
                            ? String.valueOf(
                                    remote.get("description")
                            )
                            : null
            );

            /*
             * ----------------------------------------------------
             * CHECK WHETHER THE GITHUB REPOSITORY HAS CHANGED
             * ----------------------------------------------------
             *
             * New repositories already start as PENDING.
             *
             * Existing repositories need their current GitHub
             * commit checked against the commit that RepoLens
             * successfully indexed.
             */
            if (existing) {

                String currentCommitSha =
                        githubApiClient.getBranchCommitSha(
                                token,
                                repo.getOwner(),
                                repo.getName(),
                                repo.getDefaultBranch()
                        );

                checkForRepositoryChanges(
                        repo,
                        currentCommitSha
                );
            }

            /*
             * New repositories should always start as PENDING.
             */
            if (!existing) {

                if (repo.getIndexStatus() == null) {
                    repo.setIndexStatus(
                            IndexStatus.PENDING
                    );
                }
            }

            repo.setUpdatedAt(
                    Instant.now()
            );

            /*
             * Fallback owner detection.
             */
            if (repo.getOwner() == null ||
                    repo.getOwner().isBlank()) {

                Object ownerObj =
                        remote.get("owner");

                if (ownerObj instanceof Map<?, ?> ownerMap
                        && ownerMap.get("login") != null) {

                    repo.setOwner(
                            String.valueOf(
                                    ownerMap.get("login")
                            )
                    );
                }
            }

            saved.add(
                    repositoryRepository.save(repo)
            );
        }

        return saved.stream()
                .sorted(
                        (a, b) ->
                                a.getFullName()
                                        .compareToIgnoreCase(
                                                b.getFullName()
                                        )
                )
                .map(this::toResponse)
                .toList();
    }

    /**
     * Checks whether the GitHub repository has a newer commit
     * than the commit currently represented by the vector index.
     */
    private void checkForRepositoryChanges(
            Repository repo,
            String currentCommitSha
    ) {

        /*
         * If GitHub did not return a SHA, do not change
         * the current repository state.
         */
        if (currentCommitSha == null ||
                currentCommitSha.isBlank()) {

            return;
        }

        /*
         * IMPORTANT:
         *
         * Repositories that were indexed before we introduced
         * indexedCommitSha will have a null value.
         *
         * If such a repository currently says READY, we need
         * one re-index so that RepoLens can establish the first
         * known indexed commit.
         */
        if (repo.getIndexedCommitSha() == null ||
                repo.getIndexedCommitSha().isBlank()) {

            if (repo.getIndexStatus() ==
                    IndexStatus.READY) {

                repo.setIndexStatus(
                        IndexStatus.PENDING
                );

                repo.setErrorMessage(null);
            }

            return;
        }

        /*
         * Never interrupt an indexing operation.
         */
        if (repo.getIndexStatus() ==
                IndexStatus.INDEXING) {

            return;
        }

        /*
         * GitHub has changed since the last successful
         * indexing operation.
         */
        if (!currentCommitSha.equals(
                repo.getIndexedCommitSha()
        )) {

            repo.setIndexStatus(
                    IndexStatus.PENDING
            );

            repo.setErrorMessage(null);

            /*
             * IMPORTANT:
             *
             * Keep the old indexedCommitSha.
             *
             * It represents the version currently stored
             * inside the vector database.
             *
             * IndexingService will replace it only after
             * the new indexing operation succeeds.
             */
        }
    }

    private static Long toLong(
            Object value
    ) {

        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.parseLong(
                String.valueOf(value)
        );
    }

    public RepositoryResponse toResponse(Repository repo){
        return new RepositoryResponse(
                repo.getId(),
                repo.getGithubRepoId(),
                repo.getOwner(),
                repo.getName(),
                repo.getFullName(),
                repo.isPrivate(),
                repo.getDefaultBranch(),
                repo.getLanguage(),
                repo.getHtmlUrl(),
                repo.getDescription(),
                repo.getIndexStatus(),
                repo.getIndexedCommitSha(),
                repo.getIndexedAt(),
                repo.getChunkCount(),
                repo.getFilesTotal(),
                repo.getFilesProcessed(),
                repo.getErrorMessage());
        }

    @Transactional(readOnly = true)
    public List<RepositoryResponse> listStored(
            UUID userId
    ) {

        return repositoryRepository
                .findByUserIdOrderByFullNameAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Repository requireOwned(
            UUID repoId,
            UUID userId
    ) {

        return repositoryRepository
                .findByIdAndUserId(
                        repoId,
                        userId
                )
                .orElseThrow(
                        () ->
                                new NotFoundException(
                                        "Repository not found"
                                )
                );
    }

    @Transactional(readOnly = true)
    public IndexStatusResponse status(
            UUID repoId,
            UUID userId
    ) {

        Repository repo =
                requireOwned(
                        repoId,
                        userId
                );

        return new IndexStatusResponse(
                repo.getId(),
                repo.getIndexStatus(),
                repo.getFilesTotal(),
                repo.getFilesProcessed(),
                repo.getChunkCount(),
                repo.getIndexedAt(),
                repo.getErrorMessage()
        );
    }
}