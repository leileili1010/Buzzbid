package com.gt.buzzbid.service.auction;

import com.gt.buzzbid.db.DatabaseService;
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
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }

                if (rs != null) {
                    try {
                        rs.close();
                    } catch (SQLException e) {
                        throw new RuntimeException(e);
                    }
                }
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

                SimpleDateFormat fmt = new SimpleDateFormat("M/d/yyyy HH:mm a");
                model.setAuctionEndTime(fmt.format(rs.getTimestamp("auction_end_time")));

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

        return model;
    }
}
