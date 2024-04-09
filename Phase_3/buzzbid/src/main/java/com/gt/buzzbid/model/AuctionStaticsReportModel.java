package com.gt.buzzbid.model;


import com.gt.buzzbid.Condition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class AuctionStaticsReportModel {

    private Integer activeAuction;
    private Integer finishedAuction;
    private Integer wonAuction;
    private Integer cancelledAuction;
    private Integer ratedItems;
    private Integer notRatedItems;

}
