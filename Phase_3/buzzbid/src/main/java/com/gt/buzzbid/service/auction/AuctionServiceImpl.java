package com.gt.buzzbid.service.auction;

import com.gt.buzzbid.model.BidModel;
import com.gt.buzzbid.service.bid.BidServiceImpl;
import com.gt.buzzbid.service.db.DatabaseService;
import com.gt.buzzbid.entity.Category;
import com.gt.buzzbid.entity.Item;
import com.gt.buzzbid.model.AuctionModel;
import com.gt.buzzbid.service.item.ItemServiceImpl;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
        String query = "INSERT INTO Auction(item_id, auction_end_time, auction_length, get_it_now_price, min_sale_price, starting_bid, cancel_reason, cancelled_by)" +
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
    public AuctionModel getAuction(Integer auctionId) {
        AuctionModel model = new AuctionModel();
        Connection conn = null;
        ResultSet rs = null;
        String query = "SELECT item_id, auction_end_time, get_it_now_price, starting_bid FROM Auction WHERE auction_id = ?";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, auctionId);

            rs = stmt.executeQuery();

            if (rs != null && rs.next()) {
                model.setItemId(rs.getInt("item_id"));
                model.setAuctionEndTime(FMT.format(rs.getTimestamp("auction_end_time")));
                model.setAuctionEnded(rs.getTimestamp("auction_end_time").toLocalDateTime().isBefore(LocalDateTime.now()));

                if (rs.getObject("get_it_now_price") != null) {
                    model.setGetItNowPrice("$" + rs.getBigDecimal("get_it_now_price").toPlainString());
                }

                model.setStartingBid("$" + rs.getBigDecimal("starting_bid").toPlainString());
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
        String query = "UPDATE Auction SET auction_end_time = ?, cancelled_by = ?, cancel_reason = ? WHERE auction_id = ?";

        try {
             conn = DatabaseService.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             stmt.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
             stmt.setString(2, auctionModel.getUsername());
             stmt.setString(3, auctionModel.getCancelReason());
             stmt.setInt(4, auctionId);
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
}
