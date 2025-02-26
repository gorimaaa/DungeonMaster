package fr.urouen.dungeon_master.controller;

import fr.urouen.dungeon_master.config.security.JwtConfig;
import fr.urouen.dungeon_master.dto.auth.AccessTokenDto;
import fr.urouen.dungeon_master.dto.auth.AuthTokensDto;
import fr.urouen.dungeon_master.dto.auth.LoginRequestDto;
import fr.urouen.dungeon_master.dto.auth.RegisterRequestDto;
import fr.urouen.dungeon_master.exception.custom.ApiException;
import fr.urouen.dungeon_master.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtConfig jwtConfig;
    public AuthController(AuthService authService, JwtConfig jwtConfig) {
        this.authService = authService;
        this.jwtConfig = jwtConfig;
    }

    private void addCookie(HttpServletResponse response, String value) {
        Cookie cookie = new Cookie("refresh_token", value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) jwtConfig.getRefreshExpiration()/1000);

        response.addCookie(cookie);
    }
    private ResponseEntity<AccessTokenDto> handleAuthResponse(HttpServletResponse response, String accessToken, String refreshToken) {
        addCookie(response, refreshToken);

        return ResponseEntity.ok(AccessTokenDto.builder()
                .accessToken(accessToken)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AccessTokenDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response) {
        AuthTokensDto authResponse = authService.login(loginRequestDto);
        return handleAuthResponse(response, authResponse.getAccessToken(), authResponse.getRefreshToken());
    }

    @PostMapping("/register")
    public ResponseEntity<AccessTokenDto> register(@Valid @RequestBody RegisterRequestDto registerRequestDto, HttpServletResponse response) {
        AuthTokensDto authResponse = authService.register(registerRequestDto);
        return handleAuthResponse(response, authResponse.getAccessToken(), authResponse.getRefreshToken());
    }

    @GetMapping("/refresh")
    public ResponseEntity<AccessTokenDto> refreshToken(@CookieValue(value = "refresh_token", required = false) String refreshToken, HttpServletResponse response) {
        if (refreshToken == null) {
            throw new ApiException("Refresh token non fourni","missing_refresh_token_error", HttpStatus.FORBIDDEN);
        }

        String newAccessToken = authService.refreshAccessToken(refreshToken);

        if (newAccessToken == null) {
            throw new ApiException("Refresh token non valide","invalid_refresh_token_error", HttpStatus.FORBIDDEN);
        }

        return handleAuthResponse(response, newAccessToken, refreshToken);
    }

}
