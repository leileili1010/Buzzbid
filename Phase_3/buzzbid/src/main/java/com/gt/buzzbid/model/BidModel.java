package com.gt.buzzbid.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BidModel {
    private String username;
    private String bidAmount;
    private String bidTime;
}
