package validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import validation.validator.LoginValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = LoginValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Login {
    String message() default "Login is not valid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
