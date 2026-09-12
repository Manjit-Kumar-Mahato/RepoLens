package backend.prog.services.ai;

import java.util.Collections;
import java.util.List;

import org.springframework.ai.document.Document;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.json.JsonMapper;

import backend.prog.dto.CitationDto;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CitationMapper {

    private final JsonMapper jsonMapper;

    public CitationDto fromDocument(Document document) {
        var meta = document.getMetadata();

        return new CitationDto(
                stringVal(meta.get("filePath")),
                intVal(meta.get("startLine")),
                intVal(meta.get("endLine")),
                stringVal(meta.get("language"))
        );
    }

    public String toJson(List<CitationDto> citations) {
        try {
            return jsonMapper.writeValueAsString(
                    citations == null ? Collections.emptyList() : citations
            );
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }

    public List<CitationDto> fromJson(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return jsonMapper.readValue(
                    json,
                    new TypeReference<List<CitationDto>>() {}
            );
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }

    private String stringVal(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private Integer intVal(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }

        if (value == null) {
            return null;
        }

        try {
            return Integer.valueOf(String.valueOf(value));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}