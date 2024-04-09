package com.gt.buzzbid.model;


import com.gt.buzzbid.Condition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class UserReportModel {
    private String userName;
    private Integer listed;
    private Integer sold;
    private Integer won;
    private Integer rated;
    private Condition mostFreCondition;
}
