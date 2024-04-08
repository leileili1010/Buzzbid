package com.gt.buzzbid.controller;

import com.gt.buzzbid.entity.Category;
import com.gt.buzzbid.model.AuctionModel;
import com.gt.buzzbid.service.auction.AuctionServiceImpl;
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

}
