package com.example.demo.controller;

import com.example.demo.service.AdminAIChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAIChatController {

    private final AdminAIChatService adminAIChatService;

    public AdminAIChatController(
            AdminAIChatService adminAIChatService) {

        this.adminAIChatService = adminAIChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(
            @RequestBody AdminAIChatRequest request) {

        if (request == null
                || request.getQuestion() == null
                || request.getQuestion().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Please enter a question.");
        }

        String response =
                adminAIChatService.chat(
                        request.getQuestion()
                );

        return ResponseEntity.ok(response);
    }

    public static class AdminAIChatRequest {

        private String question;

        public AdminAIChatRequest() {
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }
    }
}