package com.gt.buzzbid.service.rating;

import com.gt.buzzbid.service.db.DatabaseService;
import com.gt.buzzbid.entity.Rating;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {

    @Override
    public Rating getRatingById(Integer ratingId) {
        Rating rating = null;
        String query = "SELECT rating_id, item_id, username, number_of_stars, comment, rating_time FROM Rating WHERE rating_id = ?";
        try (Connection conn = DatabaseService.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, ratingId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    rating = new Rating();
                    rating.setRatingId(rs.getInt("rating_id"));
                    rating.setItemId(rs.getInt("item_id"));
                    rating.setUsername(rs.getString("username"));
                    rating.setNumberOfStars(rs.getInt("number_of_stars"));
                    rating.setComment(rs.getString("comment"));
                    rating.setRatingTime(rs.getTimestamp("rating_time"));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving rating by ID: " + ratingId, e);
        }
        return rating;
    }

    @Override
    public List<Rating> getAllRatingsForItem(Integer itemId) {
        return null;
    }

    @Override
    public List<Rating> getAllRatingsForItem(String itemName) {
        List<Rating> ratings = new ArrayList<>();
        Connection conn = null;
        ResultSet rs = null;
        String query = "SELECT r.rating_id, r.item_id, r.username, r.number_of_stars, r.comment, r.rating_time FROM Rating r " +
                "JOIN Item i ON r.item_id = i.item_id " +
                "WHERE i.item_name = ? " +
                "ORDER BY r.rating_time DESC";


        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, itemName);

            rs = stmt.executeQuery();

            while (rs.next()) {
                Rating rating = new Rating();
                rating.setRatingId(rs.getInt("rating_id"));
                rating.setItemId(rs.getInt("item_id"));
                rating.setUsername(rs.getString("username"));
                rating.setNumberOfStars(rs.getInt("number_of_stars"));
                rating.setComment(rs.getString("comment"));
                rating.setRatingTime(rs.getTimestamp("rating_time"));

                ratings.add(rating);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }

            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        return ratings;
    }

    @Override
    public Double getAvgRating(Integer itemId) {
        return null;
    }

    @Override
    public Double getAvgRating(String itemName) {
        Double avgRating = null;
        String query = "SELECT ROUND(AVG(number_of_stars),2) as avg_rating FROM Rating r " +
                "JOIN Item i ON r.item_id = i.item_id " +
                "WHERE i.item_name = ?";

        try (Connection conn = DatabaseService.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, itemName);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    double value = rs.getDouble("avg_rating");
                    if (!rs.wasNull()) {
                        avgRating = value;
                    }
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving average rating for item ID: " + itemName, e);
        }
        return avgRating;
    }


    @Override
    public void deleteRating(Integer ratingId) {
        Connection conn = null;
        String query = "DELETE FROM Rating WHERE rating_id = ?";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, ratingId);
            stmt.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }


    @Override
    public Integer createRating(Rating rating) {
        Integer ratingId = null;
        Connection conn = null;
        ResultSet rs = null;
        String query = "INSERT INTO Rating(item_id, username, number_of_stars, comment, rating_time) VALUES (?, ?, ?, ?, ?)";

        try {
            LocalDateTime now = LocalDateTime.now();
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, rating.getItemId());
            stmt.setString(2, rating.getUsername());
            stmt.setInt(3, rating.getNumberOfStars());
            stmt.setString(4, rating.getComment());
            stmt.setTimestamp(5, Timestamp.valueOf(now));
            stmt.executeUpdate();

            rs = stmt.getGeneratedKeys();

            if (rs.next()) {
                ratingId = rs.getInt(1);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        }
        return ratingId;
    }

}
