package com.gt.buzzbid.model;


import com.gt.buzzbid.Condition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class AuctionStaticsReportModel {

    public Integer activeAuction;
    public Integer finishedAuction;
    public Integer wonAuction;
    public Integer cancelledAuction;
    public Integer ratedItems;
    public Integer notRatedItems;

    public AuctionStaticsReportModel(Integer activeAuction, Integer finishedAuction, Integer wonAuction, Integer cancelledAuction, Integer ratedItems, Integer notRatedItems) {
        this.activeAuction = activeAuction;
        this.finishedAuction = finishedAuction;
        this.wonAuction = wonAuction;
        this.cancelledAuction = cancelledAuction;
        this.ratedItems = ratedItems;
        this.notRatedItems = notRatedItems;
    }
}
