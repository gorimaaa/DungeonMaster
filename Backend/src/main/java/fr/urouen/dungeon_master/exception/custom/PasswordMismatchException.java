package fr.urouen.dungeon_master.exception.custom;

import org.springframework.http.HttpStatus;

public class PasswordMismatchException extends ApiException{
    public PasswordMismatchException(String message,String error) {
        super(message, error ,HttpStatus.BAD_REQUEST);
    }
}
