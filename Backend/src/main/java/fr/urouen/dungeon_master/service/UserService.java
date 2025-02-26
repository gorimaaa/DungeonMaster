package fr.urouen.dungeon_master.service;

import fr.urouen.dungeon_master.dto.user.UserProfileResponseDto;

public interface UserService {
    UserProfileResponseDto getProfile();
}
