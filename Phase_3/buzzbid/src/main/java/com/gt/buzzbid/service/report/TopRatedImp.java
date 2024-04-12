package com.gt.buzzbid.service.report;

import com.gt.buzzbid.model.TopRatedReportModel;
import com.gt.buzzbid.service.db.DatabaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TopRatedImp implements  TopRatedService {
    @Override
    public List<TopRatedReportModel> getTopRatedReport() {
        List<TopRatedReportModel> topRatedReport = new ArrayList<>();

        String query = "WITH rated_items AS (SELECT i.item_name,\n" +
                "ROUND(avg(r.number_of_stars), 1) AS avg_rating,\n" +
                "COUNT(r.*) AS rating_count\n" +
                "FROM Item i\n" +
                "JOIN Rating r ON i.item_id = r.item_id\n" +
                "GROUP BY 1)\n" +
                "SELECT i.item_name AS itemname,\n" +
                "ri.avg_rating AS avg_rating,\n" +
                "ri.rating_count AS ratingcount\n" +
                "FROM Item i\n" +
                "JOIN rated_items ri ON ri.item_name = i.item_name\n" +
                "ORDER BY 2 DESC, 1\n" +
                "LIMIT 10;";

        Connection connection = null;
        ResultSet resultSet = null;

        try {
            connection = DatabaseService.getConnection();
            PreparedStatement stmt = connection.prepareStatement(query);

            resultSet = stmt.executeQuery();

            while (resultSet.next()) {
                topRatedReport.add(new TopRatedReportModel(resultSet.getString("itemname"),resultSet.getDouble("avg_rating"),resultSet.getInt("ratingcount")));


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