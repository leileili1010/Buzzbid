package com.gt.buzzbid.service.report;

import com.gt.buzzbid.model.AuctionStaticsReportModel;
import com.gt.buzzbid.model.CategoryReportModel;

import java.util.List;

public interface AuctionStaticsService {
    public List<AuctionStaticsReportModel> getAuctionStaticsReport();
}
