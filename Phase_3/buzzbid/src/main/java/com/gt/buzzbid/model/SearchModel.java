package com.gt.buzzbid.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class SearchModel {
    private String keyword;
    private Integer categoryId;
    private String condition;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}
