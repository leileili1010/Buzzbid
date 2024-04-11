package com.gt.buzzbid.controller;

import com.gt.buzzbid.entity.Item;
import com.gt.buzzbid.response.ApiResponse;
import com.gt.buzzbid.service.item.ItemServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/item")
public class ItemController {


    @Autowired
    private ItemServiceImpl itemService;

    @GetMapping("/{itemId}")
    public ResponseEntity<?> getItem(@PathVariable Integer itemId) {
        Item item = itemService.getItem(itemId);
        if (item == null) {
            ApiResponse response = new ApiResponse();
            response.setMessage("Item with ID " + itemId + " does not exist.");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(item);
    }
}

