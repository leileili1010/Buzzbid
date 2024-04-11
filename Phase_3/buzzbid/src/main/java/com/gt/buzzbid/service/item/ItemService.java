package com.gt.buzzbid.service.item;
import java.math.BigDecimal;
import java.util.List;

import com.gt.buzzbid.Condition;
import com.gt.buzzbid.entity.Item;
import com.gt.buzzbid.model.AuctionModel;
import com.gt.buzzbid.model.SearchModel;

public interface ItemService {
    public Integer createItem(AuctionModel auctionModel);
    public void updateItem(AuctionModel auctionModel);
    public Item getItem(Integer itemId);
    public Item getItem(Integer itemId, SearchModel searchModel);
    public void editItemDescription(Integer itemId, String description);
    //public List<Item> searchItems(String keyword, Integer categoryId, BigDecimal minPrice, BigDecimal maxPrice, Condition condAtLeast);
}
