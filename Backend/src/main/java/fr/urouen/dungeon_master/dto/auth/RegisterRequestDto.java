package fr.urouen.dungeon_master.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.util.Objects;

@Getter
@Builder
public class RegisterRequestDto {
    @NotBlank(message = "Le nom d'utilisateur ne peut pas être vide")
    @Size(min = 3, max = 50, message = "Le nom d'utilisateur doit comporter entre 3 et 50 caractères")
    private final String username;

    @NotBlank(message = "L'email ne peut pas être vide")
    @Size(min = 3, max = 50, message = "L'email doit comporter entre 3 et 50 caractères")
    @Email(message = "L'email doit être valide")
    private final String email;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @Size(min = 8, message = "Le mot de passe doit comporter au moins 8 caractères")
    private final String password;

    @NotBlank(message = "La confirmation du mot de passe ne peut pas être vide")
    private final String passwordConfirmation;

    public boolean isPasswordValid() {
        return Objects.equals(this.password, this.passwordConfirmation);
    }
}
