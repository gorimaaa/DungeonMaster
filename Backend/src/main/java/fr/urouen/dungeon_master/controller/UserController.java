package fr.urouen.dungeon_master.controller;

import fr.urouen.dungeon_master.dto.user.UserProfileResponseDto;
import fr.urouen.dungeon_master.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDto> profile() {
        UserProfileResponseDto userProfileResponseDto = userService.getProfile();
        return ResponseEntity.ok(userProfileResponseDto);
    }
}
