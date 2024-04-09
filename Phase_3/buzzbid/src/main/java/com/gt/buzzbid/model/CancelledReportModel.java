package com.gt.buzzbid.model;


import com.gt.buzzbid.Condition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class CancelledReportModel {

    private Integer itemID;
    private String listedBy;
    private String cancelledDate;
    private String reason;

}
