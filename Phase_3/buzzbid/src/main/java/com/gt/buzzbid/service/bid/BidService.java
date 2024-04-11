package com.gt.buzzbid.service.bid;

import com.gt.buzzbid.model.BidModel;
import com.gt.buzzbid.model.SearchModel;

import java.util.List;

public interface BidService {
    public Integer createBid(Integer auctionId, BidModel bidModel);
    public List<BidModel> getBids(Integer auctionId);
    public List<BidModel> getBids(Integer auctionId, SearchModel searchModel);
    public BidModel getBidById(Integer bidId);
}
