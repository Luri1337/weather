package validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import validation.annotation.Login;

public class LoginValidator implements ConstraintValidator<Login, String> {

    @Override
    public boolean isValid(String login, ConstraintValidatorContext constraintValidatorContext) {
        login = login.trim();
        if (login.isEmpty()) {
            return false;
        }
        return login.matches("^[A-Za-z][A-Za-z0-9._]{2,19}$");
    }
}
