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

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/rating")
public class RatingController {

    @Autowired
    private RatingServiceImpl ratingService;
    @Autowired
    private ItemServiceImpl itemService;

    @GetMapping("/{ratingId}")
    public ResponseEntity<?> getRatingById(@PathVariable Integer ratingId) {
        Rating rating = ratingService.getRatingById(ratingId);
        if (rating == null) {
            ApiResponse response = new ApiResponse();
            response.setMessage("Rating with ID " + ratingId + " does not exist.");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(rating);
    }

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

    @GetMapping("/avg/{itemId}")
    public ResponseEntity<?> getAverageRating(@PathVariable Integer itemId) {
        Item item = itemService.getItem(itemId);
        ApiResponse response = new ApiResponse();
        if (item == null) {
            response.setMessage("Item with ID " + itemId + " does not exist.");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        Double avgRating = ratingService.getAvgRating(itemId);
        if (avgRating == null) {
            response.setMessage("No ratings found for item with ID " + itemId);
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(avgRating);
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
    public ResponseEntity<ApiResponse> deleteRating(@PathVariable Integer ratingId, Principal principal) {
        Rating rating = ratingService.getRatingById(ratingId);
        ApiResponse response = new ApiResponse();

        // Check if there's a logged-in user
        if (principal == null) {
            response.setMessage("Not authorized. Please log in first.");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        // Check if the rating exists
        if (rating == null) {
            response.setMessage("Rating with ID " + ratingId + " does not exist.");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        // check if current user is the author of the rating
        String currentUsername = principal.getName();
        if (!rating.getUsername().equals(currentUsername)) {
            response.setMessage("You do not have permission to delete this rating.");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }

        // delete rating
        ratingService.deleteRating(ratingId);
        response.setMessage("Rating deleted successfully");
        response.setSuccess(true);
        return ResponseEntity.ok(response);
    }
}
