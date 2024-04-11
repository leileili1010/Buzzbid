package com.gt.buzzbid.service.item;
import com.gt.buzzbid.entity.Item;
import com.gt.buzzbid.model.AuctionModel;

public interface ItemService {
    public Integer createItem(AuctionModel auctionModel);
    public void updateItem(AuctionModel auctionModel);
    public Item getItem(Integer itemId);
    public void editItemDescription(Integer itemId, String description);
}
