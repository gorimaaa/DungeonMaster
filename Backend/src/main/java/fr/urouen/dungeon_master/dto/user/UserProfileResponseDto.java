package fr.urouen.dungeon_master.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Builder
@Getter
public class UserProfileResponseDto {
    private final Long id;
    private final String username;
    private final String email;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private final Date createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private final Date updatedAt;
}
