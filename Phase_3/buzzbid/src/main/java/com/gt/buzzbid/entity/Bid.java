package com.gt.buzzbid.entity;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class Bid {
    private Integer bidId;
    private Integer auctionId;
    private String username;
    private BigDecimal bidAmount;
    private Date bidTime;
}
