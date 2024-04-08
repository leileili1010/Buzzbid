package com.gt.buzzbid.service.auction;

import com.gt.buzzbid.entity.Category;
import com.gt.buzzbid.model.AuctionModel;

import java.util.List;

public interface AuctionService {
    public List<Category> getCategories();
    public Category getCategoryById(Integer categoryId);
    public Integer createAuction(Integer itemId, AuctionModel auctionModel);
    public AuctionModel getAuction(Integer auctionId);
}
