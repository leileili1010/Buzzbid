package com.gt.buzzbid.entity;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class Auction {
    private Integer auctionId;
    private Integer itemId;
    private Date auctionEndTime;
    private Integer auctionLength;
    private BigDecimal getItNowPrice;
    private BigDecimal minSalePrice;
    private BigDecimal startingBid;
    private String cancelReason;
    private String cancelledBy;
}
