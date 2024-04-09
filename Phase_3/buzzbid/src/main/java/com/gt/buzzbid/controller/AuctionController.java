package com.gt.buzzbid.controller;

import com.gt.buzzbid.entity.Category;
import com.gt.buzzbid.model.AuctionModel;
import com.gt.buzzbid.model.BidModel;
import com.gt.buzzbid.response.ApiResponse;
import com.gt.buzzbid.service.auction.AuctionServiceImpl;
import com.gt.buzzbid.service.bid.BidServiceImpl;
import com.gt.buzzbid.service.item.ItemServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auction")
public class AuctionController {
    @Autowired
    private AuctionServiceImpl auctionService;
    @Autowired
    private ItemServiceImpl itemService;
    @Autowired
    private BidServiceImpl bidService;

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return auctionService.getCategories();
    }

    @PostMapping("/listAuction")
    public Integer createAuction(@RequestBody AuctionModel auctionModel) {
        Integer itemId = itemService.createItem(auctionModel);

        return auctionService.createAuction(itemId, auctionModel);
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<AuctionModel> getAuction(@PathVariable Integer auctionId) {
        AuctionModel model = auctionService.getAuction(auctionId);

        return ResponseEntity.ok(model);
    }

    @PostMapping("/{auctionId}/bid")
    public ResponseEntity<ApiResponse> bidAuction(@PathVariable Integer auctionId, @RequestBody BidModel bidModel) {
        bidService.createBid(auctionId, bidModel);

        return ResponseEntity.ok(new ApiResponse());
    }

    @PostMapping("/{auctionId}/getItNow")
    public ResponseEntity<ApiResponse> getItNow(@PathVariable Integer auctionId, @RequestBody BidModel bidModel) {
        auctionService.getItNow(auctionId, bidModel);

        return ResponseEntity.ok(new ApiResponse());
    }

    @PostMapping("/{auctionId}/cancel")
    public ResponseEntity<ApiResponse> cancelAuction(@PathVariable Integer auctionId, @RequestBody AuctionModel auctionModel) {

        return ResponseEntity.ok(new ApiResponse());
    }
}