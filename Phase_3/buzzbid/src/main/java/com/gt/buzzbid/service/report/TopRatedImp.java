package com.gt.buzzbid.service.report;

import com.gt.buzzbid.model.TopRatedReportModel;
import com.gt.buzzbid.service.db.DatabaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TopRatedImp implements TopRatedService {
    @Override
    public List<TopRatedReportModel> getTopRatedReport() {
        List<TopRatedReportModel> topRatedReport = new ArrayList<>();
        String query = "SELECT i.item_name, " + //
                "       ROUND(avg(r.number_of_stars), 1) AS avg_rating, " + //
                "       COUNT(r.*)                       AS rating_count " + //
                "FROM Item i " + //
                "         JOIN Rating r ON i.item_id = r.item_id " + //
                "GROUP BY 1 " + //
                "ORDER BY 2 DESC, 1 " + //
                "LIMIT 10";

        Connection connection = null;
        ResultSet resultSet = null;

        try {
            connection = DatabaseService.getConnection();
            PreparedStatement stmt = connection.prepareStatement(query);

            resultSet = stmt.executeQuery();

            while (resultSet.next()) {
                topRatedReport.add(new TopRatedReportModel(resultSet.getString("item_name"), resultSet.getDouble("avg_rating"), resultSet.getInt("rating_count")));
            }
        } catch (SQLException e) {
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

        return topRatedReport;
    }
}