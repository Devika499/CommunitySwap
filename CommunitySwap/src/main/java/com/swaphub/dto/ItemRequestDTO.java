package com.swaphub.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import com.swaphub.model.Item.ItemType;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequestDTO {
    private UUID id;
    private String title;
    private String description;
    private String category;
    private ItemType type;
    private String location;
    private MultipartFile imageFile; // The actual file upload
    private String imageUrl; // For existing image URL or to indicate removal
    private boolean removeImage; // Flag to indicate if current image should be removed
    private Double latitude;
    private Double longitude;
} 