package fr.urouen.dungeon_master.service;

import fr.urouen.dungeon_master.dto.auth.AuthTokensDto;
import fr.urouen.dungeon_master.dto.auth.LoginRequestDto;
import fr.urouen.dungeon_master.dto.auth.RegisterRequestDto;
import fr.urouen.dungeon_master.exception.custom.PasswordMismatchException;
import org.springframework.security.core.AuthenticationException;


public interface AuthService {
    AuthTokensDto login(LoginRequestDto loginRequestDto) throws AuthenticationException;

    AuthTokensDto register(RegisterRequestDto registerRequestDto) throws PasswordMismatchException;

    String refreshAccessToken(String refreshToken);
}