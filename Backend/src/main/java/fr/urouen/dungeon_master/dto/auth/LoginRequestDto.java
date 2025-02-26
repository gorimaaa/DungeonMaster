package fr.urouen.dungeon_master.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginRequestDto {
    private final String username;
    private final String password;
}
