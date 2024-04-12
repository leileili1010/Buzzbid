package com.gt.buzzbid.service.report;

import com.gt.buzzbid.model.CancelledReportModel;
import com.gt.buzzbid.model.CategoryReportModel;
import com.gt.buzzbid.service.db.DatabaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CancelledAuctionImp implements CancelledAuctionService{
    @Override
    public List<CancelledReportModel> getCancelledReport() {

            List<CancelledReportModel> cancelledReportModels = new ArrayList<>();

            String query="SELECT i.item_id AS itemid,\n" +
                    "i.username AS username,\n" +
                    "a.auction_end_time AS endtime,\n" +
                    "a.cancel_reason AS reason\n" +
                    "FROM Item i\n" +
                    "JOIN Auction a ON a.item_id = i.item_id\n" +
                    "WHERE a.cancelled_by IS NOT NULL\n" +
                    "ORDER BY 1 DESC;";
            Connection connection = null;
            ResultSet resultSet = null;
            try {
                connection = DatabaseService.getConnection();
                PreparedStatement stmt = connection.prepareStatement(query);

                resultSet = stmt.executeQuery();

                while (resultSet.next()) {
                    cancelledReportModels.add(new CancelledReportModel(resultSet.getInt("itemid"),
                            resultSet.getString("username"),
                            resultSet.getString("endtime"),
                            resultSet.getString("reason")));
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            } finally {
                try {
                    if (connection != null) {
                        connection.close();
                    }

                    if (resultSet != null) {
                        resultSet.close();
                    }
                } catch (SQLException e) {

                }
            }



            return cancelledReportModels;
        }
    }

