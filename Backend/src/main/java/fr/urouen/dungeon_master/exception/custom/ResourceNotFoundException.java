package fr.urouen.dungeon_master.exception.custom;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String message,String error) {
        super(message,error ,HttpStatus.NOT_FOUND);
    }
}