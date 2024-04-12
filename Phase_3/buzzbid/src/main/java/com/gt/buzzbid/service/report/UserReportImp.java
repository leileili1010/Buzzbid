package com.gt.buzzbid.service.report;

import com.gt.buzzbid.Condition;
import com.gt.buzzbid.model.CategoryReportModel;
import com.gt.buzzbid.model.UserReportModel;
import com.gt.buzzbid.service.db.DatabaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UserReportImp implements UserReportService {
    @Override
    public List<UserReportModel> getUserReport() {
        List<UserReportModel> userReport = new ArrayList<>();
        Connection connection = null;
        ResultSet resultSet = null;

        String query="WITH listed_items AS (SELECT username As username,\n" +
                "COUNT(*) AS listed_count\n" +
                "FROM Item\n" +
                "GROUP BY 1),\n" +
                "sold_items AS (SELECT i.username,\n" +
                "COUNT(*) AS sold_count\n" +
                "FROM Item i\n" +
                "JOIN Auction a ON i.item_id = a.item_id\n" +
                "WHERE a.cancelled_by IS NULL\n" +
                "AND a.auction_end_time < now()\n" +
                "AND EXISTS (SELECT 1\n" +
                "FROM Bid b\n" +
                "WHERE b.auction_id = a.auction_id\n" +
                "AND (b.bid_amount > a.min_sale_price OR\n" +
                "b.bid_amount = a.get_it_now_price))\n" +
                "GROUP BY 1),\n" +
                "won_items AS (SELECT b.username,\n" +
                "COUNT(a.*) AS won_count\n" +
                "FROM Bid b\n" +
                "JOIN Auction a ON b.auction_id = a.auction_id\n" +
                "WHERE a.cancelled_by IS NULL\n" +
                "AND a.auction_end_time < now()\n" +
                "AND b.username IN (SELECT DISTINCT ON (b1.auction_id)\n" +
                "b1.username\n" +
                "FROM Bid b1\n" +
                "WHERE b1.auction_id = b.auction_id\n" +
                "AND (b1.bid_amount >=a.min_sale_price OR\n" +
                "b1.bid_amount = a.get_it_now_price)\n" +
                "ORDER BY b1.auction_id,\n" +
                "b1.bid_amount DESC)\n" +
                "GROUP BY 1),\n" +
                "rated_items AS (SELECT username,\n" +
                "COUNT(*) AS rated_count\n" +
                "FROM Rating r\n" +
                "GROUP BY 1),\n" +
                "category_freq AS (SELECT DISTINCT ON (username)\n" +
                "username,\n" +
                "freq_condition\n" +
                "FROM (SELECT username,\n" +
                "condition AS freq_condition,\n" +
                "COUNT(*) as condition_count\n" +
                "FROM Item\n" +
                "GROUP BY 1, 2\n" +
                "ORDER BY 3 DESC, 2 DESC) c\n" +
                "ORDER BY 1, condition_count DESC, 2 DESC)\n" +
                "SELECT u.username,\n" +
                "COALESCE(l.listed_count, 0) AS listed_count,\n" +
                "COALESCE(s.sold_count, 0) AS sold_count,\n" +
                "COALESCE(w.won_count, 0) AS won_count,\n" +
                "COALESCE(r.rated_count, 0) AS rated_count,\n" +
                "COALESCE(c.freq_condition::text, 'N/A') AS freq_condition\n" +
                "FROM \"User\" u\n" +
                "LEFT JOIN listed_items l ON u.username = l.username\n" +
                "LEFT JOIN sold_items s ON u.username = s.username\n" +
                "LEFT JOIN won_items w ON u.username = w.username\n" +
                "LEFT JOIN rated_items r ON u.username = r.username\n" +
                "LEFT JOIN category_freq c ON u.username = c.username\n" +
                "ORDER BY 2 DESC;";

        try {
            connection = DatabaseService.getConnection();
            PreparedStatement stmt = connection.prepareStatement(query);

            resultSet = stmt.executeQuery();

            while (resultSet.next()) {
                userReport.add(new UserReportModel(resultSet.getString("username"),resultSet.getInt("listed_count"),resultSet.getInt("sold_count"),resultSet.getInt("won_count"),
                        resultSet.getInt("rated_count"),resultSet.getString("freq_condition")));
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





        return userReport;
    }
}
