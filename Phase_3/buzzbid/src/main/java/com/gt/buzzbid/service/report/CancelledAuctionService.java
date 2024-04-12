package com.gt.buzzbid.service.report;

import com.gt.buzzbid.model.CancelledReportModel;
import com.gt.buzzbid.model.CategoryReportModel;

import java.util.List;

public interface CancelledAuctionService {
    public List<CancelledReportModel> getCancelledReport();
}
