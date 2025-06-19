package com.swaphub.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FileSystemStorageService implements StorageService {

    @Value("${storage.upload-dir:uploads}") // Default to 'uploads' directory
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(uploadDir);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        String filename = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file " + filename);
            }
            Path destinationFile = this.rootLocation.resolve(
                    Paths.get(filename))
                    .normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                // This is a security check
                throw new RuntimeException("Cannot store file outside current directory.");
            }
            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
        // Return the full URL path to be stored in the database
        return "http://localhost:8080/uploads/" + filename;
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read stored files", e);
        }
    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

    @Override
    public void deleteAll() {
        // Caution: This deletes all files in the upload directory!
        // Files.walk(rootLocation, 1).filter(path -> !path.equals(rootLocation)).forEach(path -> {
        //     try { Files.delete(path); } catch (IOException e) { /* log error */ }
        // });
    }

    @Override
    public void delete(String filename) {
        try {
            Path fileToDelete = rootLocation.resolve(filename).normalize().toAbsolutePath();
            if (Files.exists(fileToDelete) && Files.isRegularFile(fileToDelete)) {
                Files.delete(fileToDelete);
            } else {
                // Handle cases where file does not exist or is not a regular file
                System.err.println("File not found or is not a regular file: " + filename);
            }
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + filename + ". Error: " + e.getMessage());
            throw new RuntimeException("Failed to delete file: " + filename, e);
        }
    }
} 