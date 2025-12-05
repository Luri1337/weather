package dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import validation.annotation.Login;
import validation.annotation.Password;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor()
public class UserDto {
    @Login
    private String login;
    @Password
    private String password;
}
