package com.gt.buzzbid.controller;

import com.gt.buzzbid.entity.Item;
import com.gt.buzzbid.entity.Rating;
import com.gt.buzzbid.response.ApiResponse;
import com.gt.buzzbid.service.rating.RatingServiceImpl;
import com.gt.buzzbid.service.item.ItemServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rating")
public class RatingController {

    @Autowired
    private RatingServiceImpl ratingService;
    @Autowired
    private ItemServiceImpl itemService;

    @GetMapping("/item/{itemId}")
    public ResponseEntity<?> getAllRatingsForItem(@PathVariable Integer itemId) {
        // first check if itemId is valid
        ApiResponse response = new ApiResponse();
        Item item = itemService.getItem(itemId);
        if (item == null) {
            response.setMessage("Item with ID " + itemId + " does not exist.");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        // then find all ratings
        List<Rating> ratings = ratingService.getAllRatingsForItem(itemId);
        return ResponseEntity.ok(ratings);
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createRating(@RequestBody Rating rating) {
        Integer ratingId = ratingService.createRating(rating);
        ApiResponse response = new ApiResponse();
        if (ratingId != null) {
            response.setMessage("Rating created successfully with ID: " + ratingId);
            return ResponseEntity.ok(response);
        } else {
            response.setMessage("Failed to create rating");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/delete/{ratingId}")
    public ResponseEntity<ApiResponse> deleteRating(@PathVariable Integer ratingId) {
        ratingService.deleteRating(ratingId);
        ApiResponse response = new ApiResponse();
        response.setMessage("Rating deleted successfully");
        return ResponseEntity.ok(response);
    }
}

