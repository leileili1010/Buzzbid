package com.gt.buzzbid.service.report;

import com.gt.buzzbid.model.CategoryReportModel;
import com.gt.buzzbid.service.db.DatabaseService;
import io.micrometer.common.util.StringUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CategoryReportImp implements CategoryReportService {
    @Override
    public List<CategoryReportModel> getCategoryReport() {
        List<CategoryReportModel> categoryReport = new ArrayList<>();
        String query = "SELECT c.category as category,COUNT(i.*) as total_items, "  + //
                "MIN(a.get_it_now_price) AS min_price, "  + //
                "MAX(a.get_it_now_price) AS max_price, "  + //
                "ROUND(avg(a.get_it_now_price), 2) as avg_price "  + //
                "FROM Item i JOIN Category c ON i.category_id = c.category_id "  + //
                "JOIN Auction a ON i.item_id = a.item_id "  + //
                "WHERE a.cancelled_by IS NULL "  + //
                "GROUP BY c.category "  + //
                "ORDER BY c.category;";
        Connection connection = null;
        ResultSet resultSet = null;

        try {
            connection = DatabaseService.getConnection();
            PreparedStatement stmt = connection.prepareStatement(query);

            resultSet = stmt.executeQuery();

            while (resultSet.next()) {
                categoryReport.add(new CategoryReportModel(resultSet.getString("category"),
                        resultSet.getInt("total_items"),
                         (StringUtils.isNotBlank(resultSet.getString("min_price")) ? "$"  + resultSet.getString("min_price") : "N/A"),
                         (StringUtils.isNotBlank(resultSet.getString("max_price")) ? "$"  + resultSet.getString("max_price") : "N/A"),
                         (StringUtils.isNotBlank(resultSet.getString("avg_price")) ? "$"  + resultSet.getString("avg_price") : "N/A")));
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

        return categoryReport;
    }
}