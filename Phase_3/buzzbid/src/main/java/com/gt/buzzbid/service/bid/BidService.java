package com.gt.buzzbid.service.bid;

import com.gt.buzzbid.model.BidModel;

import java.util.List;

public interface BidService {
    public Integer createBid(Integer auctionId, BidModel bidModel);
    public List<BidModel> getBids(Integer auctionId);
    public BidModel getBidById(Integer bidId);
}
