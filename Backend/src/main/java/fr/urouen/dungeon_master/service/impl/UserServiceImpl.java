package fr.urouen.dungeon_master.service.impl;

import fr.urouen.dungeon_master.dto.user.UserProfileResponseDto;
import fr.urouen.dungeon_master.mapper.UserMapper;
import fr.urouen.dungeon_master.repository.UserRepository;
import fr.urouen.dungeon_master.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    public UserServiceImpl(UserRepository userRepository,
                           UserMapper userMapper
                           ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;

    }

    @Override
    public UserProfileResponseDto getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return this.userMapper.fromEntity(userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé : " + username)));
    }
}
