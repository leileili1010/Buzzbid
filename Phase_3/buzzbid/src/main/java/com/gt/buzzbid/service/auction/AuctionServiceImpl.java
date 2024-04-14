package com.gt.buzzbid.service.auction;

import com.gt.buzzbid.model.AuctionResultModel;
import com.gt.buzzbid.Condition;
import com.gt.buzzbid.model.BidModel;
import com.gt.buzzbid.model.SearchModel;
import com.gt.buzzbid.service.bid.BidServiceImpl;
import com.gt.buzzbid.service.db.DatabaseService;
import com.gt.buzzbid.entity.Category;
import com.gt.buzzbid.entity.Item;
import com.gt.buzzbid.model.AuctionModel;
import com.gt.buzzbid.service.item.ItemServiceImpl;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class AuctionServiceImpl implements AuctionService {
    @Autowired
    private ItemServiceImpl itemService;
    @Autowired
    private BidServiceImpl bidService;
    private final SimpleDateFormat FMT =  new SimpleDateFormat("M/d/yyyy HH:mm a");

    @Override
    public List<Category> getCategories() {
        List<Category> categories = new ArrayList<>();
        String query = "SELECT category_id, category FROM category";
        Connection conn = null;
        ResultSet rs = null;

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);

            rs = stmt.executeQuery();

            while (rs.next()) {
                categories.add(new Category(rs.getInt("category_id"), rs.getString("category")));
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

        return categories;
    }

    @Override
    public Category getCategoryById(Integer categoryId) {
        Category category = new Category();
        String query = "SELECT category_id, category FROM category WHERE category_id = ?";
        Connection conn = null;
        ResultSet rs = null;

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, categoryId);

            rs = stmt.executeQuery();

            if (rs != null && rs.next()) {
                category.setCategoryId(rs.getInt("category_id"));
                category.setCategory(rs.getString("category"));
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

        return category;
    }

    @Override
    public Integer createAuction(Integer itemId, AuctionModel auctionModel) {
        Integer auctionId = null;
        Connection conn = null;
        ResultSet rs = null;
        String query = "INSERT INTO Auction(item_id, auction_end_time, auction_length, get_it_now_price, min_sale_price, starting_bid, cancel_reason, cancelled_timestamp)" +
                " VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, itemId);
            stmt.setTimestamp(2, Timestamp.valueOf(LocalDateTime.now().plusDays(auctionModel.getAuctionLength())));
            stmt.setInt(3, auctionModel.getAuctionLength());
            stmt.setBigDecimal(4, (StringUtils.isNotBlank(auctionModel.getGetItNowPrice())
                    ? new BigDecimal(auctionModel.getGetItNowPrice()) : null));
            stmt.setBigDecimal(5, new BigDecimal(auctionModel.getMinSalePrice()));
            stmt.setBigDecimal(6, new BigDecimal(auctionModel.getStartingBid()));
            stmt.setObject(7, null);
            stmt.setObject(8, null);
            stmt.executeUpdate();

            rs = stmt.getGeneratedKeys();

            if (rs.next()) {
                auctionId = rs.getInt(1);
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

        return auctionId;
    }

    @Override
    public List<AuctionModel> searchItems(SearchModel searchModel) {
        List<AuctionModel> models = new ArrayList<>();
        Connection conn = null;
        ResultSet rs = null;
        String query = "WITH current_bidder AS (SELECT DISTINCT ON (b.auction_id) " + //
                "                                      b.auction_id, " + //
                "                                      b.bid_amount, " + //
                "                                      b.username " + //
                "                               FROM Bid b " + //
                "                               JOIN Auction a on b.auction_id = a.auction_id " + //
                "                               WHERE a.auction_end_time > now() " + //
                "                               AND a.cancelled_timestamp IS NULL " +//
                "                               ORDER BY 1, 2 DESC) " + //
                " SELECT i.item_id, " +
                "        a.auction_id, " + //
                "        i.item_name, " + //
                "        c.bid_amount, " + //
                "        c.username, " + //
                "        a.get_it_now_price, " + //
                "        a.auction_end_time " + //
                " FROM Item i " + //
                " JOIN Auction a ON i.item_id = a.item_id " + //
                " JOIN Category cat ON i.category_id = cat.category_id " + //
                " LEFT JOIN current_bidder c ON c.auction_id = a.auction_id " + //
                " WHERE a.auction_end_time > now() " + //
                " AND a.cancelled_timestamp IS NULL " + //
                " AND (? IS NULL OR i.item_name ~ ? OR i.description ~ ?) " + //
                " AND (? IS NULL OR cat.category_id = ?) " + //
                " AND (? IS NULL OR (CASE WHEN c.bid_amount IS NOT NULL THEN c.bid_amount >= ? ELSE a.starting_bid >= ? END)) " + //
                " AND (? IS NULL OR (CASE WHEN c.bid_amount IS NOT NULL THEN c.bid_amount <= ? ELSE a.starting_bid <= ? END)) " + //
                " AND (?::cond IS NULL OR i.condition <= ?::cond)";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, searchModel.getKeyword());
            stmt.setString(2, searchModel.getKeyword());
            stmt.setString(3, searchModel.getKeyword());

            if (searchModel.getCategoryId() == null) {
                stmt.setNull(4, Types.INTEGER);
                stmt.setNull(5, Types.INTEGER);
            } else {
                stmt.setInt(4, searchModel.getCategoryId());
                stmt.setInt(5, searchModel.getCategoryId());
            }

            stmt.setBigDecimal(6, searchModel.getMinPrice());
            stmt.setBigDecimal(7, searchModel.getMinPrice());
            stmt.setBigDecimal(8, searchModel.getMinPrice());
            stmt.setBigDecimal(9, searchModel.getMaxPrice());
            stmt.setBigDecimal(10, searchModel.getMaxPrice());
            stmt.setBigDecimal(11, searchModel.getMaxPrice());
            stmt.setString(12, StringUtils.isNotBlank(searchModel.getCondition())
                    ? Condition.valueOf(searchModel.getCondition()).getLabel() : null);
            stmt.setString(13, StringUtils.isNotBlank(searchModel.getCondition())
                    ? Condition.valueOf(searchModel.getCondition()).getLabel() : null);

            rs = stmt.executeQuery();

            if (rs != null) { // iterate through the result sets and if getItem()!=null, push a new AuctionModel to the return list
                while (rs.next()){
                    // get the item that meets the search criteria; if we have it, get the attributes from item
                    AuctionModel model = new AuctionModel();
                    model.setItemId(rs.getInt("item_id"));
                    model.setAuctionId(rs.getInt("auction_id"));
                    model.setItemName(rs.getString("item_name"));

                    if (rs.getBigDecimal("bid_amount") != null) {
                        model.setCurrentBid("$" + rs.getBigDecimal("bid_amount").toString());
                    }

                    model.setHighBidder(rs.getString("username"));

                    if (rs.getObject("get_it_now_price") != null) {
                        model.setGetItNowPrice("$" + rs.getBigDecimal("get_it_now_price").toPlainString());
                    }

                    model.setAuctionEndTime(FMT.format(rs.getTimestamp("auction_end_time")));
                    models.add(model);
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

        return models;
    }

    @Override
    public AuctionModel getAuction(Integer auctionId) {
        AuctionModel model = new AuctionModel();
        Connection conn = null;
        ResultSet rs = null;
        String query = "SELECT item_id, " + //
                "auction_end_time, " + //
                "get_it_now_price, " + //
                "starting_bid, " + //
                "min_sale_price," +
                "cancelled_timestamp " + //
                "FROM Auction " + //
                "WHERE auction_id = ?";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, auctionId);

            rs = stmt.executeQuery();

            if (rs != null && rs.next()) {
                model.setItemId(rs.getInt("item_id"));
                model.setAuctionEndTime(FMT.format(rs.getTimestamp("auction_end_time")));
                model.setAuctionEnded(rs.getTimestamp("auction_end_time").toLocalDateTime().isBefore(LocalDateTime.now())
                        || rs.getTimestamp("cancelled_timestamp") != null);

                if (rs.getObject("get_it_now_price") != null) {
                    model.setGetItNowPrice("$" + rs.getBigDecimal("get_it_now_price").toPlainString());
                }

                model.setStartingBid("$" + rs.getBigDecimal("starting_bid").toPlainString());

                if (rs.getTimestamp("cancelled_timestamp") != null) {
                    model.setCancelledTime(FMT.format(rs.getTimestamp("cancelled_timestamp")));
                }
            }

            // get item
            Item item = itemService.getItem(model.getItemId());
            model.setItemName(item.getItemName());
            model.setDescription(item.getDescription());

            Category category = getCategoryById(item.getCategoryId());

            model.setCategory(category.getCategory());
            model.setConditionLabel(item.getCondition().getLabel());
            model.setIsReturnable(String.valueOf(item.isReturnable()));
            model.setUsername(item.getUsername());
            model.setBids(bidService.getBids(auctionId));

            BigDecimal minBid = rs.getBigDecimal("starting_bid");

            if (!CollectionUtils.isEmpty(model.getBids())) {
                BidModel highestBid = Collections.max(model.getBids(), Comparator.comparing(b -> new BigDecimal(b.getBidAmount().substring(1))));

                if (highestBid != null) {
                    minBid = new BigDecimal(highestBid.getBidAmount().substring(1)).add(new BigDecimal("1"));
                }
            }

            model.setMinimumBid("$" + minBid.toPlainString());

            if (model.isAuctionEnded()) {
                if (!CollectionUtils.isEmpty(model.getBids())) {
                    // set if min sale price was met or exceeded
                    BidModel highestBid = Collections.max(model.getBids(), Comparator.comparing(b -> new BigDecimal(b.getBidAmount().substring(1))));
                    model.setMinSalePriceMet(new BigDecimal(highestBid.getBidAmount().substring(1)).compareTo(rs.getBigDecimal("min_sale_price")) >= 0);
                }

                // add a cancelled model if this auction was cancelled, and remove the last element
                if (StringUtils.isNotBlank(model.getCancelledTime())) {
                    BidModel cancelledBid = new BidModel();
                    cancelledBid.setBidAmount("Cancelled");
                    cancelledBid.setBidTime(model.getCancelledTime());
                    cancelledBid.setUsername("Administrator");
                    model.getBids().add(0, cancelledBid);

                    if (model.getBids().size() > 4) {
                        model.getBids().remove(model.getBids().size() - 1);
                    }
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

        return model;
    }

    @Override
    public void getItNow(Integer auctionId, BidModel bidModel) {
        Connection conn = null;
        ResultSet rs = null;
        String query = "UPDATE Auction SET auction_end_time = ? WHERE auction_id = ?";
        Integer bidId = bidService.createBid(auctionId, bidModel);
        BidModel bid = bidService.getBidById(bidId);

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setTimestamp(1, Timestamp.valueOf(bid.getBidTime()));
            stmt.setInt(2, auctionId);
            stmt.executeUpdate();
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
    }

    @Override
    public void cancelAuction(Integer auctionId, AuctionModel auctionModel) {
        Connection conn = null;
        ResultSet rs = null;
        String query = "UPDATE Auction SET cancelled_timestamp = ?, cancel_reason = ? WHERE auction_id = ?";

        try {
             conn = DatabaseService.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             stmt.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
             stmt.setString(2, auctionModel.getUsername());
             stmt.setInt(3, auctionId);
             stmt.executeUpdate();
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
    }

    @Override
    public void editAuction(Integer auctionId, AuctionModel auctionModel) {
        Connection conn = null;
        ResultSet rs = null;
        String query = "SELECT item_id FROM Auction WHERE auction_id = ?";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, auctionId);

            rs = stmt.executeQuery();

            if (rs != null && rs.next()) {
                itemService.editItemDescription(rs.getInt("item_id"), auctionModel.getDescription());
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
    }

    @Override
    public List<AuctionResultModel> getAuctionResults() {
        List<AuctionResultModel> auctionResults = new ArrayList<>();
        Connection conn = null;
        ResultSet rs = null;
        String query = "WITH winning_bids AS (SELECT DISTINCT ON (b.auction_id) "
                + "                                  b.auction_id, "
                + "                                  b.bid_amount, "
                + "                                  b.username "
                + "                           FROM Bid b "
                + "                           JOIN Auction a ON b.auction_id = a.auction_id "
                + "                           WHERE a.auction_end_time < now() "
                + "                           AND (b.bid_amount >= a.min_sale_price "
                + "                                 OR b.bid_amount = a.get_it_now_price) "
                + "                           AND a.cancelled_timestamp IS NULL "
                + "                           ORDER BY 1, 2 DESC) "
                + "SELECT a.auction_id, "
                + "         i.item_id, "
                + "       i.item_name, "
                + "       (CASE "
                + "           WHEN a.cancelled_timestamp IS NOT NULL "
                + "               THEN null "
                + "           WHEN wb.bid_amount < a.min_sale_price"
                + "               THEN null "
                + "           ELSE wb.bid_amount "
                + "        END) AS sale_price, "
                + "       (CASE "
                + "         WHEN a.cancelled_timestamp IS NOT NULL "
                + "             THEN 'Cancelled' "
                + "         WHEN wb.bid_amount < a.min_sale_price "
                + "             THEN null "
                + "         ELSE wb.username "
                + "        END) AS winner, "
                + "       a.auction_end_time AS auction_ended "
                + "FROM Item i "
                + "JOIN Auction a ON i.item_id = a.item_id "
                + "LEFT JOIN winning_bids wb ON a.auction_id = wb.auction_id "
                + "WHERE a.auction_end_time < now() OR a.cancelled_timestamp IS NOT NULL "
                + "ORDER BY a.auction_end_time DESC;";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);

            rs = stmt.executeQuery();

            if (rs != null) {
                while (rs.next()) {
                    AuctionResultModel auctionResult = new AuctionResultModel();
                    auctionResult.setAuctionId(rs.getInt("auction_id"));
                    auctionResult.setItemId(rs.getInt("item_id"));
                    auctionResult.setItemName(rs.getString("item_name"));
                    if (rs.getObject("sale_price") != null) {
                        auctionResult.setSalePrice("$" + rs.getBigDecimal("sale_price").toPlainString());
                    }

                    auctionResult.setWinner(rs.getString("winner"));
                    auctionResult.setAuctionEnded(rs.getTimestamp("auction_ended"));
                    auctionResults.add(auctionResult);
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
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return auctionResults;
    }
}
