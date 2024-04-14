package com.gt.buzzbid.service.rating;

import com.gt.buzzbid.entity.Rating;

import java.util.List;

public interface RatingService {
    Rating getRatingById(Integer ratingId);

    List<Rating> getAllRatingsForItem(Integer itemId);

    List<Rating> getAllRatingsForItem(String itemName);

    Double getAvgRating(Integer itemId);

    Double getAvgRating(String itemName);

    void deleteRating(Integer ratingId);

    Integer createRating(Rating rating);
}
