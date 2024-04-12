package com.gt.buzzbid.model;

import com.gt.buzzbid.Condition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AuctionModel {
    private Integer itemId;
    private Integer auctionId;
    private String itemName;
    private String description;
    private Integer categoryId;
    private String category;
    private Condition condition;
    private String conditionLabel;
    private String startingBid;
    private String minSalePrice;
    private Integer auctionLength;
    private String getItNowPrice;
    private String isReturnable;
    private String username;
    private String auctionEndTime;
    private List<BidModel> bids;
    private boolean auctionEnded;
    private String cancelReason;
    private String highBidder;
    private String currentBid;
}
