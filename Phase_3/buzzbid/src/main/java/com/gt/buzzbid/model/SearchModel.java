package com.gt.buzzbid.model;

import com.gt.buzzbid.Condition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SearchModel {

    private String keyword;
    private Integer categoryId;
    private Condition condition;
    private Integer minPrice;
    private Integer maxPrice;
}
