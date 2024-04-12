package com.gt.buzzbid.model;


import com.gt.buzzbid.Condition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class TopRatedReportModel {
    private String itemName;
    private Double avgRating;
    private Integer ratingCount;

    public TopRatedReportModel(String itemName, Double avgRating, Integer ratingCount) {
        this.itemName = itemName;
        this.avgRating = avgRating;
        this.ratingCount = ratingCount;
    }
}
