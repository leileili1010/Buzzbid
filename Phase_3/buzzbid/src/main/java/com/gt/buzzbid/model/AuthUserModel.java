package com.gt.buzzbid.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthUserModel {
    private String username;
    private String firstName;
    private String lastName;
    private String position;
    private String message;
    private boolean success;
    private String token;
}
