package fr.urouen.dungeon_master.exception.custom;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus status;
    private final String error;

    public ApiException(String message,String error,HttpStatus status) {
        super(message);
        this.status = status;
        this.error = error;
    }
}
