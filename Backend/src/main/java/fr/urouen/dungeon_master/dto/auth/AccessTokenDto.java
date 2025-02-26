package fr.urouen.dungeon_master.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AccessTokenDto {
    @JsonProperty("access_token")
    private final String accessToken;
}
