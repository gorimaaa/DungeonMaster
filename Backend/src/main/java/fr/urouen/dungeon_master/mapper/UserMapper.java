package fr.urouen.dungeon_master.mapper;

import fr.urouen.dungeon_master.dto.auth.RegisterRequestDto;
import fr.urouen.dungeon_master.dto.user.UserProfileResponseDto;
import fr.urouen.dungeon_master.entity.User;
import fr.urouen.dungeon_master.enums.Role;
import fr.urouen.dungeon_master.exception.custom.PasswordMismatchException;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class UserMapper {
    public User toEntity(RegisterRequestDto registerRequestDto)throws PasswordMismatchException {
        if (!registerRequestDto.isPasswordValid()) {
            throw new PasswordMismatchException("Les mots de passe ne correspondent pas","password_mismatch_error");
        }
        User user=new User();
        user.setUsername(registerRequestDto.getUsername());
        user.setEmail(registerRequestDto.getEmail());
        user.setPassword(encodePassword(registerRequestDto.getPassword()));
        user.setRole(Role.ROLE_USER);
        return user;
    }

    public UserProfileResponseDto fromEntity(User user){
        return UserProfileResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .createdAt(user.getCreatedAt())
                        .updatedAt(user.getUpdatedAt())
                        .build();
    }
    private String encodePassword(String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }
}

