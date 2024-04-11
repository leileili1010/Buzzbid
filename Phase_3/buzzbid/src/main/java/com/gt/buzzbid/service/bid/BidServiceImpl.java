package com.gt.buzzbid.service.bid;

import com.gt.buzzbid.model.BidModel;
import com.gt.buzzbid.model.SearchModel;
import com.gt.buzzbid.service.db.DatabaseService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BidServiceImpl implements BidService {
    private final SimpleDateFormat FMT =  new SimpleDateFormat("M/d/yyyy HH:mm a");

    @Override
    public Integer createBid(Integer auctionId, BidModel bidModel) {
        Integer bidId = null;
        Connection conn = null;
        ResultSet rs = null;
        String query = "INSERT INTO Bid(auction_id, username, bid_amount, bid_time) VALUES (?, ?, ?, ?)";

        try {
            LocalDateTime now = LocalDateTime.now();
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, auctionId);
            stmt.setString(2, bidModel.getUsername());
            stmt.setBigDecimal(3, new BigDecimal(bidModel.getBidAmount()));
            stmt.setTimestamp(4, Timestamp.valueOf(now));
            stmt.executeUpdate();

            rs = stmt.getGeneratedKeys();

            if (rs != null && rs.next()) {
                bidId = rs.getInt(1);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }

                if (rs != null) {
                    rs.close();
                }
            } catch (SQLException e) {

            }
        }

        return bidId;
    }

    @Override
    public List<BidModel> getBids(Integer auctionId) {
        List<BidModel> bidModels = new ArrayList<>();
        Connection conn = null;
        ResultSet rs = null;
        String query = "SELECT username, bid_amount, bid_time FROM Bid WHERE auction_id = ? ORDER BY 3 DESC LIMIT 4";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, auctionId);

            rs = stmt.executeQuery();

            if (rs != null) {
                while (rs.next()) {
                    BidModel bidModel = new BidModel();
                    bidModel.setUsername(rs.getString("username"));
                    bidModel.setBidAmount("$" + rs.getBigDecimal("bid_amount").toPlainString());
                    bidModel.setBidTime(FMT.format(rs.getTimestamp("bid_time")));
                    bidModels.add(bidModel);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }

                if (rs != null) {
                    rs.close();
                }
            } catch (SQLException e) {

            }
        }

        return bidModels;
    }

    @Override
    public List<BidModel> getBids(Integer auctionId, SearchModel searchModel) {
        List<BidModel> bidModels = new ArrayList<>();
        Connection conn = null;
        ResultSet rs = null;
        String query = "SELECT username, bid_amount, bid_time FROM Bid WHERE auction_id = ? AND AND cancelled_by IS NULL ORDER BY 1, 2 DESC";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, auctionId);

            rs = stmt.executeQuery();

            if (rs != null) {
                while (rs.next()) {
                    BidModel bidModel = new BidModel();
                    bidModel.setUsername(rs.getString("username"));
                    bidModel.setBidAmount("$" + rs.getBigDecimal("bid_amount").toPlainString());
                    bidModel.setBidTime(FMT.format(rs.getTimestamp("bid_time")));
                    bidModels.add(bidModel);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }

                if (rs != null) {
                    rs.close();
                }
            } catch (SQLException e) {

            }
        }

        return bidModels;
    }

    @Override
    public BidModel getBidById(Integer bidId) {
        BidModel model = new BidModel();
        Connection conn = null;
        ResultSet rs = null;
        String query = "SELECT username, bid_amount, bid_time  FROM Bid WHERE bid_id = ?";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, bidId);

            rs = stmt.executeQuery();

            if (rs != null && rs.next()) {
                model.setUsername(rs.getString("username"));
                model.setBidAmount(rs.getBigDecimal("bid_amount").toPlainString());
                model.setBidTime(rs.getTimestamp("bid_time").toString());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }

                if (rs != null) {
                    rs.close();
                }
            } catch (Exception e) {

            }
        }

        return model;
    }
}
