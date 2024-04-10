package com.gt.buzzbid.service.rating;

import com.gt.buzzbid.entity.Rating;

import java.util.List;

public interface RatingService {
    List<Rating> getAllRatingsForItem(Integer itemId);

    void deleteRating(Integer ratingId);

    Integer createRating(Rating rating);
}
