package com.swaphub.controller;

import com.swaphub.model.Item;
import com.swaphub.model.Item.ItemType;
import com.swaphub.model.User;
import com.swaphub.repository.ItemRepository;
import com.swaphub.repository.UserRepository;
import com.swaphub.security.CustomUserDetails;
import com.swaphub.service.storage.StorageService;
import com.swaphub.dto.ItemRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

import com.swaphub.service.ItemService;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository; // You need this to fetch user entity

    @Autowired
    private ItemService itemService; // Inject ItemService

    @Autowired
    private StorageService storageService; // Inject StorageService

    @PostMapping
    public Item createItem(@ModelAttribute ItemRequestDTO itemDTO) {
        User currentUser = getCurrentUserFromSecurityContext();
        
        // Debug logging
        System.out.println("Received latitude: " + itemDTO.getLatitude());
        System.out.println("Received longitude: " + itemDTO.getLongitude());
        
        Item item = new Item();
        item.setTitle(itemDTO.getTitle());
        item.setDescription(itemDTO.getDescription());
        item.setCategory(itemDTO.getCategory());
        item.setType(itemDTO.getType());
        item.setLocation(itemDTO.getLocation());
        item.setUser(currentUser);
        item.setLatitude(itemDTO.getLatitude());
        item.setLongitude(itemDTO.getLongitude());

        if (itemDTO.getImageFile() != null && !itemDTO.getImageFile().isEmpty()) {
            String imageUrl = storageService.store(itemDTO.getImageFile());
            item.setImageUrl(imageUrl);
        }

        return itemRepository.save(item);
    }
    
    @GetMapping("/{id}") // New method to get a single item by ID
    public Item getItemById(@PathVariable UUID id) {
        return itemService.getItemById(id);
    }

    @GetMapping
    public List<Item> getItems(
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) String location) {
        if (type != null && location != null) {
            return itemRepository.findByTypeAndLocation(type, location);
        } else if (type != null) {
            return itemRepository.findByType(type);
        } else if (location != null) {
            return itemRepository.findByLocation(location);
        }
        return itemRepository.findAll();
    }

    @GetMapping("/my-items")
    public List<Item> getMyItems() {
        User currentUser = getCurrentUserFromSecurityContext();
        return itemService.getItemsByUser(currentUser.getId());
    }

    @GetMapping("/others-items")
    public List<Item> getOthersItems() {
        User currentUser = getCurrentUserFromSecurityContext();
        return itemService.getItemsExcludingUser(currentUser.getId());
    }

    // Update an item
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public Item updateItem(@PathVariable UUID id, @ModelAttribute ItemRequestDTO itemDTO) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));

        // Update basic fields
        item.setTitle(itemDTO.getTitle());
        item.setDescription(itemDTO.getDescription());
        item.setCategory(itemDTO.getCategory());
        item.setType(itemDTO.getType());
        item.setLocation(itemDTO.getLocation());
        // Only update latitude/longitude if present in the request
        if (itemDTO.getLatitude() != null) {
            item.setLatitude(itemDTO.getLatitude());
        }
        if (itemDTO.getLongitude() != null) {
            item.setLongitude(itemDTO.getLongitude());
        }

        // Handle image update/removal
        if (itemDTO.isRemoveImage()) {
            // Delete old image if it exists
            if (item.getImageUrl() != null && !item.getImageUrl().isEmpty()) {
                String oldFilename = item.getImageUrl().substring(item.getImageUrl().lastIndexOf('/') + 1);
                storageService.delete(oldFilename);
            }
            item.setImageUrl(null); // Clear image URL in database
        } else if (itemDTO.getImageFile() != null && !itemDTO.getImageFile().isEmpty()) {
            // New image uploaded, delete old one and store new
            if (item.getImageUrl() != null && !item.getImageUrl().isEmpty()) {
                String oldFilename = item.getImageUrl().substring(item.getImageUrl().lastIndexOf('/') + 1);
                storageService.delete(oldFilename);
            }
            String newImageUrl = storageService.store(itemDTO.getImageFile());
            item.setImageUrl(newImageUrl);
        } else if (itemDTO.getImageUrl() != null && !itemDTO.getImageUrl().isEmpty()) {
            // If imageUrl is provided and no new file, assume it's an existing URL from frontend that hasn't changed
            // No action needed for image here, as it's already set in the item.
            // This else-if block can be removed if the frontend always sends an image file or a removeImage flag for changes
        } else {
            // No new file, no remove flag, no new URL provided, keep current URL unless it was explicitly null/empty
        }

        return itemRepository.save(item);
    }

    // Delete an item
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable UUID id) {
        itemRepository.deleteById(id);
    }
    private User getCurrentUserFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }
    @GetMapping("/nearby")
    public List<Item> getItemsNearby(
        @RequestParam double latitude,
        @RequestParam double longitude,
        @RequestParam double radiusKm
    ) {
        User currentUser = getCurrentUserFromSecurityContext();
        List<Item> allNearby = itemRepository.findByLocationWithinRadius(latitude, longitude, radiusKm);
        // Filter out items posted by the current user
        return allNearby.stream()
            .filter(item -> !item.getUser().getId().equals(currentUser.getId()))
            .toList();
    }
}