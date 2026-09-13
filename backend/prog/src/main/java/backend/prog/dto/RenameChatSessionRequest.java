package backend.prog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RenameChatSessionRequest(

        @NotBlank
        @Size(max = 200)
        String title

) {
}