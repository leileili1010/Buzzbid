package com.gt.buzzbid.service.item;

import com.gt.buzzbid.Condition;
import com.gt.buzzbid.service.db.DatabaseService;
import com.gt.buzzbid.entity.Item;
import com.gt.buzzbid.model.AuctionModel;
import org.springframework.stereotype.Service;

import java.sql.*;

@Service
public class ItemServiceImpl implements ItemService {

    public Integer createItem(AuctionModel auctionModel) {
        Integer itemId = null;
        Connection conn = null;
        ResultSet rs = null;
        String query = "INSERT INTO Item(username, item_name, description, is_returnable, condition, category_id) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, auctionModel.getUsername());
            stmt.setString(2, auctionModel.getItemName());
            stmt.setString(3, auctionModel.getDescription());
            stmt.setBoolean(4, Boolean.parseBoolean(auctionModel.getIsReturnable()));
            stmt.setObject(5, auctionModel.getCondition().getLabel(), Types.OTHER);
            stmt.setInt(6, auctionModel.getCategoryId());
            stmt.executeUpdate();

            rs = stmt.getGeneratedKeys();

            if (rs.next()) {
                itemId = rs.getInt(1);
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

        return itemId;
    }

    @Override
    public void updateItem(AuctionModel auctionModel) {

    }

    @Override
    public Item getItem(Integer itemId) {
        Item item = null;
        Connection conn = null;
        ResultSet rs = null;
        String query = "SELECT username, item_name, description, category_id, condition::text, is_returnable FROM Item WHERE item_id = ?";

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, itemId);

            rs = stmt.executeQuery();

            if (rs != null && rs.next()) {
                item = new Item();
                item.setUsername(rs.getString("username"));
                item.setItemName(rs.getString("item_name"));
                item.setDescription(rs.getString("description"));
                item.setCategoryId(rs.getInt("category_id"));
                item.setCondition(Condition.getByLabel(rs.getString("condition")));
                item.setReturnable(rs.getBoolean("is_returnable"));
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

        return item;
    }
}
