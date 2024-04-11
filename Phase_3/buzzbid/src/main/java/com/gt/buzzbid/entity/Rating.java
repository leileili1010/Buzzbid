package com.gt.buzzbid.entity;

import lombok.*;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class Rating {
    private Integer ratingId;
    private Integer itemId;
    private String username;
    private Integer numberOfStars;
    private String comment;
    private Timestamp ratingTime;
}
