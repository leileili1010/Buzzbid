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

    public UserReportModel(String userName, Integer listed, Integer sold, Integer won, Integer rated, Condition mostFreCondition) {
        this.userName = userName;
        this.listed = listed;
        this.sold = sold;
        this.won = won;
        this.rated = rated;
        this.mostFreCondition = mostFreCondition;
    }

    private Condition mostFreCondition;
}
