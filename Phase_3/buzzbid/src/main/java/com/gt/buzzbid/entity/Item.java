package com.gt.buzzbid.entity;

import com.gt.buzzbid.Condition;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class Item {
    private Integer itemId;
    private String username;
    private String itemName;
    private String description;
    private boolean isReturnable;
    private Condition condition;
    private Integer categoryId;
}
