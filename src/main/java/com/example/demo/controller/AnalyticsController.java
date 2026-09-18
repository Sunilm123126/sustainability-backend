package com.example.demo.controller;

import com.example.demo.dto.DashboardResponse;
import com.example.demo.service.AnalyticsService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }


    // =====================================================
    // NORMAL DASHBOARD
    // =====================================================

    @GetMapping("/dashboard/{username}")
    public DashboardResponse getDashboard(
            @PathVariable String username
    ) {

        return analyticsService.getDashboard(username);
    }


    // =====================================================
    // SELECTED DATE ANALYTICS
    // =====================================================

    @GetMapping("/dashboard/{username}/selected")
    public DashboardResponse getSelectedAnalytics(

            @PathVariable String username,

            @RequestParam String date,

            @RequestParam String month,

            @RequestParam int year

    ) {

        LocalDate selectedDate =
                LocalDate.parse(date);

        return analyticsService.getSelectedDashboard(
                username,
                selectedDate,
                month,
                year
        );
    }
}