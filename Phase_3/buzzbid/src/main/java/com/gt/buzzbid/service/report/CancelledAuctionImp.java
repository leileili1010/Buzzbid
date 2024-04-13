package com.gt.buzzbid.service.report;

import com.gt.buzzbid.model.CancelledReportModel;
import com.gt.buzzbid.model.CategoryReportModel;
import com.gt.buzzbid.service.db.DatabaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class CancelledAuctionImp implements CancelledAuctionService {
    private final SimpleDateFormat FMT =  new SimpleDateFormat("M/d/yyyy HH:mm a");

    @Override
    public List<CancelledReportModel> getCancelledReport() {
        List<CancelledReportModel> cancelledReportModels = new ArrayList<>();
        String query = "SELECT i.item_id AS itemid, "  + //
                "              i.username AS username, "  + //
                "              a.cancelled_timestamp AS endtime, "  + //
                "              a.cancel_reason AS reason "  + //
                "FROM Item i "  + //
                "JOIN Auction a ON a.item_id = i.item_id "  + //
                "WHERE a.cancelled_timestamp IS NOT NULL "  + //
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
                        FMT.format(resultSet.getTimestamp("endtime")),
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