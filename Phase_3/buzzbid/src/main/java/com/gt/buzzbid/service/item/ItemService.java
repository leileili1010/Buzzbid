package com.gt.buzzbid.service.item;
import com.gt.buzzbid.model.AuctionModel;

public interface ItemService {
    public Integer createItem(AuctionModel auctionModel);
    public void updateItem(AuctionModel auctionModel);
}
