package com.zero2earn.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AppController {

    @GetMapping("/status")
    public Map<String, String> getStatus() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Zero2Earn API is running!");
        response.put("version", "1.0.0");
        return response;
    }
}
