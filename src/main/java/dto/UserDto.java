package dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDto {
    private int id;
    private final String login;
    private final String password;

    public UserDto(String login, String password) {
        this.login = login;
        this.password = password;
    }
}
