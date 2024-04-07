package com.gt.buzzbid.model;

import com.gt.buzzbid.Condition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuctionModel {
    private String itemName;
    private String description;
    private Integer categoryId;
    private Condition condition;
    private String startingBid;
    private String minSalePrice;
    private Integer auctionLength;
    private String getItNowPrice;
    private String isReturnable;
    private String username;
}
