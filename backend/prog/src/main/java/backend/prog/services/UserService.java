package backend.prog.services;
import java.util.Map;
import backend.prog.entity.User;
import backend.prog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TextEncryptor tokenEncryptor;


    @Transactional
    public User upsertFromGithub(Map<String, Object> attributes,String accessToken, String scopes) {
        Long githubId = toLong(attributes.get("id"));
        String login = String.valueOf(attributes.get("login"));
        String name = attributes.get("name") != null
                ? String.valueOf(attributes.get("name"))
                : login;
        String avatarUrl = attributes.get("avatar_url") != null
                ? String.valueOf(attributes.get("avatar_url"))
                : null;
        String encryptedToken = tokenEncryptor.encrypt(accessToken);
        User user = userRepository.findByGitId(githubId).orElseGet(User::new);

        user.setGitId(githubId);
        user.setGitUsername(login);
        user.setDisplayName(name);
        user.setAvatarUrl(avatarUrl);
        user.setAccessToken(encryptedToken);
        user.setTokenScopes(scopes);

        return userRepository.save(user);
    }

    private Long toLong(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.valueOf(value.toString());
    }

    @Transactional(readOnly = true)
    public User requiredById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional(readOnly = true)
    public User requiredByGitId(Long gitId) {
        return userRepository.findByGitId(gitId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public String decryptAccessToken(User user) {
        return tokenEncryptor.decrypt(user.getAccessToken());
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}