package com.gt.buzzbid.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

public class RatingModel {
    private Integer ratingId;
    private Integer itemId;
    private String username;
    private Integer numberOfStars;
    private String comment;
    private Date ratingTime;
}
