package com.example.demo.controller;

import com.example.demo.dto.AdminAnalyticsResponse;
import com.example.demo.service.AdminAnalyticsService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;


    public AdminAnalyticsController(
            AdminAnalyticsService adminAnalyticsService
    ) {

        this.adminAnalyticsService =
                adminAnalyticsService;
    }


    // =====================================================
    // ADMIN ANALYTICS
    // =====================================================

    @GetMapping
    public AdminAnalyticsResponse getAdminAnalytics() {

        return adminAnalyticsService
                .getAdminAnalytics();
    }
}