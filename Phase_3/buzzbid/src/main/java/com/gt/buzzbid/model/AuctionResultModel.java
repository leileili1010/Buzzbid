package com.gt.buzzbid.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
public class AuctionResultModel {
    private Integer auctionId;
    private Integer itemId;
    private String itemName;
    private Double salePrice;
    private String winner;
    private Timestamp auctionEnded;
}
