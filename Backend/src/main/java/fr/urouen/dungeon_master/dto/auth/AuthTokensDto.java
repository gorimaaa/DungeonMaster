package fr.urouen.dungeon_master.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthTokensDto {
    private final String refreshToken;

    private final String accessToken;

}
