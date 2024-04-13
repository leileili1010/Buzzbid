package com.gt.buzzbid.service.report;

import com.gt.buzzbid.model.AuctionStaticsReportModel;
import com.gt.buzzbid.service.db.DatabaseService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AuctionStaticsImp implements AuctionStaticsService {
    @Override
    public List<AuctionStaticsReportModel> getAuctionStaticsReport() {
        List<AuctionStaticsReportModel> auctionStaticsReportModels = new ArrayList<>();
        AuctionStaticsReportModel AuctionStaticsReportModel = new AuctionStaticsReportModel();

        String query1 = "SELECT COUNT(*) AS active_auctions "  + //
                "FROM Auction "  + //
                "WHERE auction_end_time > now();";

        String query2 = "SELECT COUNT(*) AS finished "  + //
                "FROM Auction "  + //
                "WHERE cancelled_by IS NULL "  + //
                "AND auction_end_time < now();";

        String query3 = "SELECT COUNT(a.*) AS won "  + //
                "FROM Auction a "  + //
                "WHERE a.cancelled_by IS NULL "  + //
                "AND a.auction_end_time < now() "  + //
                "AND EXISTS (SELECT 1 "  + //
                "            FROM Bid b "  + //
                "            WHERE b.auction_id = a.auction_id "  + //
                "            AND (b.bid_amount > a.min_sale_price "  + //
                "                   OR b.bid_amount = a.get_it_now_price));";

        String query4 = "SELECT COUNT(*) AS cancelled "  + //
                "FROM Auction "  + //
                "WHERE cancelled_by IS NOT NULL;";

        String query5 = "SELECT COUNT(*) AS itemrated "  + //
                "FROM Item i WHERE EXISTS (SELECT 1 "  + //
                "                          FROM Rating r "  + //
                "                          WHERE i.item_id = r.item_id);";

        String query6 = "SELECT COUNT(*) AS itemnotrated "  + //
                "FROM Item i "  + //
                "WHERE NOT EXISTS (SELECT 1 "  + //
                "                  FROM Rating r "  + //
                "                  WHERE i.item_id = r.item_id);";

        Connection connection = null;
        ResultSet resultSet1 = null;
        ResultSet resultSet2 = null;
        ResultSet resultSet3 = null;
        ResultSet resultSet4 = null;
        ResultSet resultSet5 = null;
        ResultSet resultSet6 = null;

        try {
            connection = DatabaseService.getConnection();
            PreparedStatement stmt1 = connection.prepareStatement(query1);
            PreparedStatement stmt2 = connection.prepareStatement(query2);
            PreparedStatement stmt3 = connection.prepareStatement(query3);
            PreparedStatement stmt4 = connection.prepareStatement(query4);
            PreparedStatement stmt5 = connection.prepareStatement(query5);
            PreparedStatement stmt6 = connection.prepareStatement(query6);

            resultSet1 = stmt1.executeQuery();
            resultSet2 = stmt2.executeQuery();
            resultSet3 = stmt3.executeQuery();
            resultSet4 = stmt4.executeQuery();
            resultSet5 = stmt5.executeQuery();
            resultSet6 = stmt6.executeQuery();

            while (resultSet1.next()) {
                AuctionStaticsReportModel.activeAuction = resultSet1.getInt("active_auctions");
            }
            while (resultSet2.next()) {
                AuctionStaticsReportModel.finishedAuction = resultSet2.getInt("finished");
            }
            while (resultSet3.next()) {
                AuctionStaticsReportModel.wonAuction = resultSet3.getInt("won");
            }
            while (resultSet4.next()) {
                AuctionStaticsReportModel.cancelledAuction = resultSet4.getInt("cancelled");
            }
            while (resultSet5.next()) {
                AuctionStaticsReportModel.ratedItems = resultSet5.getInt("itemrated");
            }
            while (resultSet6.next()) {
                AuctionStaticsReportModel.notRatedItems = resultSet6.getInt("itemnotrated");
            }
            auctionStaticsReportModels.add(AuctionStaticsReportModel);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (connection != null) {
                    connection.close();
                }

                if (resultSet1 != null) {
                    resultSet1.close();
                }
            } catch (SQLException e) {

            }
        }

        return auctionStaticsReportModels;
    }
}