package com.gt.buzzbid.model;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class CategoryReportModel {
    private String category;
    private Integer totalItems;
    private String minPrice;
    private String maxPrice;
    private String avgPrice;

    public CategoryReportModel(String category, Integer totalItems, String minPrice, String maxPrice, String avgPrice) {
        this.category = category;
        this.totalItems = totalItems;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.avgPrice = avgPrice;
    }
}
