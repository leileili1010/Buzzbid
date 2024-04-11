package com.gt.buzzbid.controller;

import com.gt.buzzbid.model.AuctionModel;
import com.gt.buzzbid.model.CategoryReportModel;
import com.gt.buzzbid.model.UserReportModel;
import com.gt.buzzbid.service.auction.AuctionServiceImpl;
import com.gt.buzzbid.service.report.CategoryReportImp;
import com.gt.buzzbid.service.report.UserReportImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/report")
public class ReportController {

    CategoryReportImp categoryReportImp = new CategoryReportImp();
    UserReportImp userReportImp = new UserReportImp();




    @GetMapping("/category_report")

   public ResponseEntity<List<CategoryReportModel>> getCategories() {

        List<CategoryReportModel> model = categoryReportImp.getCategoryReport();

        return ResponseEntity.ok(model);
    }

    @GetMapping("/user_report")

    public ResponseEntity<List<UserReportModel>> getUserreport() {

        List<UserReportModel> model = userReportImp.getUserReport();

        return ResponseEntity.ok(model);
    }
}
