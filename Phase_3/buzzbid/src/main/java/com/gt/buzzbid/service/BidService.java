package com.gt.buzzbid.service;

import com.gt.buzzbid.entity.Auction;
import com.gt.buzzbid.entity.Item;
import com.gt.buzzbid.entity.Category;
import com.gt.buzzbid.Condition;
import java.util.List;

public interface BidService {
    public void saveItem(Item item);
    public void saveAuction(Auction auction);
    public List<Item> searchForItems(String keyword, Category cat, float minPrice, float maxPrice, Condition cond);
    public Item getItemByID(Integer itemID);
    public void bidItem(Integer itemID, Integer bidID);
    public void cancelItem(Integer itemID);
}
