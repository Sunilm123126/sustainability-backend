package com.example.demo.controller;

import com.example.demo.dto.AIChatRequest;
import com.example.demo.service.AIChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AIChatController {

    private final AIChatService aiChatService;

    public AIChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(
            @RequestBody AIChatRequest request) {

        // Check whether request exists
        if (request == null) {
            return ResponseEntity.badRequest()
                    .body("Please enter a question.");
        }

        // Get username
        String username = request.getUsername();

        // Get question
        String question = request.getQuestion();

        // Check question
        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please enter a question.");
        }

        // Check username
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please login first.");
        }

        // Send question to AI service
        String response = aiChatService.chat(
                username,
                question.trim()
        );

        return ResponseEntity.ok(response);
    }
}