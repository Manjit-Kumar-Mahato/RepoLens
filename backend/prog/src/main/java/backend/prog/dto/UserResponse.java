package backend.prog.dto;

import java.util.UUID;

public record UserResponse(
        UUID id,
        Long gitId,
        String gitUsername,
        String displayName,
        String avatarUrl
) {
}