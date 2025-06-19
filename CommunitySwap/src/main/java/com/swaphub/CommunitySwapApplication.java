package com.swaphub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class CommunitySwapApplication {
    public static void main(String[] args) {
        SpringApplication.run(CommunitySwapApplication.class, args);
    }

    @GetMapping("/test")
    public String test() {
        return "API is working!";
    }
}
