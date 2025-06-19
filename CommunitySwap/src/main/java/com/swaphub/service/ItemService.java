package com.swaphub.service;

import com.swaphub.model.Item;
import java.util.List;
import java.util.UUID;

public interface ItemService {
    Item createItem(Item item);
    Item getItemById(UUID itemId);
    List<Item> getItemsByUser(UUID userId);
    List<Item> getItemsExcludingUser(UUID userId);
    boolean existsById(UUID itemId);
    Item saveItem(Item item);
}