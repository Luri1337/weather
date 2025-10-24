package dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor()
public class LocationDto {
    private String name;
    private String country;
    private double lat;
    private double lon;
    private double temp;
}
