package com.gt.buzzbid.service.report;

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
        String query = "WITH listed_items AS (SELECT username As username, " + //
                "                                    COUNT(*) AS listed_count " + //
                "                             FROM Item " + //
                "                             GROUP BY 1), " + //
                "            sold_items AS (SELECT i.username, " + //
                "                                  COUNT(*) AS sold_count " + //
                "                           FROM Item i " + //
                "                           JOIN Auction a ON i.item_id = a.item_id " + //
                "                           WHERE a.cancelled_timestamp IS NULL " + //
                "                           AND a.auction_end_time < now() " + //
                "                           AND EXISTS (SELECT 1 " + //
                "                                       FROM Bid b " + //
                "                                       WHERE b.auction_id = a.auction_id " + //
                "                                       AND (b.bid_amount > a.min_sale_price OR " + //
                "                                               b.bid_amount = a.get_it_now_price)) " + //
                "                                       GROUP BY 1), " + //
                "            won_items AS (SELECT b.username, " + //
                "                                 COUNT(a.*) AS won_count " + //
                "                          FROM Bid b " + //
                "                          JOIN Auction a ON b.auction_id = a.auction_id " + //
                "                          WHERE a.cancelled_timestamp IS NULL " + //
                "                          AND a.auction_end_time < now() " + //
                "                          AND b.username IN (SELECT DISTINCT ON (b1.auction_id) " + //
                "                                                    b1.username " + //
                "                                             FROM Bid b1 " + //
                "                                             WHERE b1.auction_id = b.auction_id " + //
                "                                             AND (b1.bid_amount >=a.min_sale_price OR " + //
                "                                                       b1.bid_amount = a.get_it_now_price) " + //
                "                                             ORDER BY b1.auction_id, b1.bid_amount DESC) " + //
                "                                             GROUP BY 1), " + //
                "            rated_items AS (SELECT username, " + //
                "                                   COUNT(*) AS rated_count " + //
                "                            FROM Rating r " + //
                "                            GROUP BY 1), " + //
                "            category_freq AS (SELECT DISTINCT ON (username) " + //
                "                                     username, " + //
                "                                     freq_condition " + //
                "                              FROM (SELECT username, " + //
                "                                           condition AS freq_condition, " + //
                "                                           COUNT(*) as condition_count " + //
                "                                    FROM Item " + //
                "                                    GROUP BY 1, 2 " + //
                "                                    ORDER BY 3 DESC, 2 DESC) c " + //
                "                              ORDER BY 1, condition_count DESC, 2 DESC) " + //
                "SELECT u.username, " + //
                "COALESCE(l.listed_count, 0) AS listed_count, " + //
                "COALESCE(s.sold_count, 0) AS sold_count, " + //
                "COALESCE(w.won_count, 0) AS won_count, " + //
                "COALESCE(r.rated_count, 0) AS rated_count, " + //
                "COALESCE(c.freq_condition::text, 'N/A') AS freq_condition " + //
                "FROM \"User\" u " + //
                "LEFT JOIN listed_items l ON u.username = l.username " + //
                "LEFT JOIN sold_items s ON u.username = s.username " + //
                "LEFT JOIN won_items w ON u.username = w.username " + //
                "LEFT JOIN rated_items r ON u.username = r.username " + //
                "LEFT JOIN category_freq c ON u.username = c.username " + //
                "ORDER BY 2 DESC;";

        try {
            connection = DatabaseService.getConnection();
            PreparedStatement stmt = connection.prepareStatement(query);

            resultSet = stmt.executeQuery();

            while (resultSet.next()) {
                userReport.add(new UserReportModel(resultSet.getString("username"), resultSet.getInt("listed_count"), resultSet.getInt("sold_count"), resultSet.getInt("won_count"),
                        resultSet.getInt("rated_count"), resultSet.getString("freq_condition")));
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