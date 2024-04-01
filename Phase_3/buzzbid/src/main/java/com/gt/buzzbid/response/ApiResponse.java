package com.gt.buzzbid.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApiResponse {
    private String message;
    private boolean success;
}
