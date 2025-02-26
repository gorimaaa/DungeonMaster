package fr.urouen.dungeon_master.service.impl;

import fr.urouen.dungeon_master.config.security.service.JwtService;
import fr.urouen.dungeon_master.dto.auth.AuthTokensDto;
import fr.urouen.dungeon_master.dto.auth.LoginRequestDto;
import fr.urouen.dungeon_master.dto.auth.RegisterRequestDto;
import fr.urouen.dungeon_master.entity.User;
import fr.urouen.dungeon_master.mapper.UserMapper;
import fr.urouen.dungeon_master.repository.UserRepository;
import fr.urouen.dungeon_master.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           JwtService jwtService,
                           UserRepository userRepository,
                            UserMapper userMapper
                           ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }
    @Override
    public AuthTokensDto login(LoginRequestDto loginRequestDto) throws AuthenticationException {
        Authentication authentication = this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword()));
        if (!authentication.isAuthenticated()) {
            throw new BadCredentialsException("Nom utilisateur ou mot de passe invalide");
        }

        return AuthTokensDto.builder()
                .accessToken(jwtService.generateAccessToken(loginRequestDto.getUsername()))
                .refreshToken(jwtService.generateRefreshToken(loginRequestDto.getUsername()))
                .build();
    }

    @Override
    public AuthTokensDto register(RegisterRequestDto registerRequestDto) throws IllegalArgumentException {
        User user=this.userMapper.toEntity(registerRequestDto);
        userRepository.save(user);
        return AuthTokensDto.builder()
                .accessToken(jwtService.generateAccessToken(user.getUsername()))
                .refreshToken(jwtService.generateRefreshToken(user.getUsername()))
                .build();
    }
    @Override
    public String refreshAccessToken(String refreshToken) {
        if (!jwtService.isValidRefreshToken(refreshToken)) {
            return null;
        }

        String username = jwtService.extractUsername(refreshToken);
        return jwtService.generateAccessToken(username);
    }
}
