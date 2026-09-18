package com.example.demo.controller;

import com.example.demo.service.RecommendationService;
import com.example.demo.dto.GeminiRecommendationResponse;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;


    public RecommendationController(
            RecommendationService recommendationService
    ) {
        this.recommendationService =
                recommendationService;
    }


    @GetMapping("/{username}")
    public List<GeminiRecommendationResponse>
    getRecommendations(
            @PathVariable String username
    ) {

        return recommendationService
                .getRecommendations(username);
    }
}