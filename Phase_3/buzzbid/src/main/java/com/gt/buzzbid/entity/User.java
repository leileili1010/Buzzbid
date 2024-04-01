package com.gt.buzzbid.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class User {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String position;
}
