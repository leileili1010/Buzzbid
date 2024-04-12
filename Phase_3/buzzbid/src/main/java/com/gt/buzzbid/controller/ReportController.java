package com.gt.buzzbid.controller;

import com.gt.buzzbid.model.*;
import com.gt.buzzbid.service.auction.AuctionServiceImpl;
import com.gt.buzzbid.service.report.*;
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

    TopRatedImp topRatedImp = new TopRatedImp();
    AuctionStaticsImp auctionStaticsImp = new AuctionStaticsImp();
    CancelledAuctionImp cancelledAuctionImp = new CancelledAuctionImp();




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

    @GetMapping("/toprate_report")

    public ResponseEntity<List<TopRatedReportModel>> getTopRatereport() {

        List<TopRatedReportModel> model = topRatedImp.getTopRatedReport();

        return ResponseEntity.ok(model);
    }

    @GetMapping("/auctionstatics_report")

    public ResponseEntity<List<AuctionStaticsReportModel>> getAuctionreport() {

        List<AuctionStaticsReportModel> model = auctionStaticsImp.getAuctionStaticsReport();

        return ResponseEntity.ok(model);
    }

    @GetMapping("/cancelled_report")

    public ResponseEntity<List<CancelledReportModel>> getCancelledReport() {

        List<CancelledReportModel> model = cancelledAuctionImp.getCancelledReport();

        return ResponseEntity.ok(model);
    }
}
