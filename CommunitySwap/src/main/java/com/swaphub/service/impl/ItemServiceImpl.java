package com.swaphub.service.impl;

import com.swaphub.model.Item;
import com.swaphub.repository.ItemRepository;
import com.swaphub.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
	private final ItemRepository itemRepository;

    @Override
    public Item createItem(Item item) {
        item.setId(UUID.randomUUID());
        return itemRepository.save(item);
    }

    @Override
    public Item getItemById(UUID itemId) {
        return itemRepository.findById(itemId)
               .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    @Override
    public List<Item> getItemsByUser(UUID userId) {
        return itemRepository.findByUserId(userId);
    }

    @Override
    public List<Item> getItemsExcludingUser(UUID userId) {
        return itemRepository.findByUserIdNot(userId);
    }

    @Override
    public boolean existsById(UUID itemId) {
        return itemRepository.existsById(itemId);
    }

    @Override
    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }
}