package backend.prog.services.ai;

import java.util.List;

import backend.prog.dto.CitationDto;

public record RetrievedContext(
    List<CitationDto> citations,
    String contextText
) {
    
}
