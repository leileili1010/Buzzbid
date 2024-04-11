package com.gt.buzzbid.service.report;

import com.gt.buzzbid.Condition;
import com.gt.buzzbid.model.CategoryReportModel;
import com.gt.buzzbid.model.UserReportModel;

import java.util.ArrayList;
import java.util.List;

public class UserReportImp implements UserReportService {
    @Override
    public List<UserReportModel> getUserReport() {
        List<UserReportModel> userReport = new ArrayList<>();

        userReport.add(new UserReportModel("user1",12,2,4,4, Condition.GOOD));
        userReport.add(new UserReportModel("user2",13,2,4,4, Condition.NEW));
        userReport.add(new UserReportModel("user3",14,2,4,4, Condition.POOR));
        userReport.add(new UserReportModel("user4",15,2,4,4, Condition.VERY_GOOD));
        userReport.add(new UserReportModel("user5",16,2,4,4, Condition.FAIR));
        userReport.add(new UserReportModel("user6",17,2,4,4, Condition.GOOD));

        return userReport;
    }
}
