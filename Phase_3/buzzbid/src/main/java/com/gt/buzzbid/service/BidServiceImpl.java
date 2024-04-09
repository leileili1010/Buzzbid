package com.gt.buzzbid.service;

import com.gt.buzzbid.Condition;
import com.gt.buzzbid.service.db.DatabaseService;
import com.gt.buzzbid.entity.Auction;
import com.gt.buzzbid.entity.Category;
import com.gt.buzzbid.entity.Item;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BidServiceImpl implements BidService{
    @Override
    public void saveItem(Item item) {
        String query = "INSERT INTO item VALUES (?, ?, ?, ?, ?, ?, ?)";
        List<Object> params = new ArrayList<>();
        Connection conn = null;

        params.add(item.getItemId());  //should itemId auto increment in DBMS or handled by Item constructor?
        params.add(item.getUsername());
        params.add(item.getItemName());
        params.add(item.getDescription());
        params.add(item.isReturnable());
        params.add(item.getCondition());
        params.add(item.getCategoryId());

        //TODO: refactor this try-catch block into a function in DatabaseService
        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            int i = 1;

            for (Object param : params) {
                stmt.setObject(i, param);
                i++;
            }

            stmt.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {

            }
        }
    }

    @Override
    public void saveAuction(Auction auction) {

    }

    @Override
    public List<Item> searchForItems(String keyword, Category cat, float minPrice, float maxPrice, Condition cond) {
        return null;
    }

    @Override
    public Item getItemByID(Integer itemID) {
        return null;
    }

    @Override
    public void bidItem(Integer itemID, Integer bidID) {

    }

    @Override
    public void cancelItem(Integer itemID) {

    }
}
