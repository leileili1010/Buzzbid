package com.gt.buzzbid.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class Category {
    private Integer categoryId;
    private String category;
}
