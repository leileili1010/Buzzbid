package com.gt.buzzbid.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuthResponse {
    private String token;
    private String message;
    private boolean success;
}
