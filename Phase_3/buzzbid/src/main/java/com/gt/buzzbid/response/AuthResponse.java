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
    private String userRole;
    private boolean success;
    private boolean isAdmin;
    private String name;
}
