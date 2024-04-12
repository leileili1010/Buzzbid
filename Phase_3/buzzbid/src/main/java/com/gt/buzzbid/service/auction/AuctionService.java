package com.gt.buzzbid.service.auction;

import com.gt.buzzbid.entity.Category;
import com.gt.buzzbid.model.AuctionModel;
import com.gt.buzzbid.model.AuctionResultModel;
import com.gt.buzzbid.model.BidModel;
import com.gt.buzzbid.model.SearchModel;

import java.util.List;

public interface AuctionService {
    public List<Category> getCategories();
    public Category getCategoryById(Integer categoryId);
    public Integer createAuction(Integer itemId, AuctionModel auctionModel);
    public AuctionModel getAuction(Integer auctionId);
    public void getItNow(Integer auctionId, BidModel bidModel);
    public void cancelAuction(Integer auctionId, AuctionModel auctionModel);
    public void editAuction(Integer auctionId, AuctionModel auctionModel);
    public List<AuctionModel> searchItems(SearchModel searchModel); //all search criteria are passed in by searchModel
    public List<AuctionResultModel> getAuctionResults();
}
