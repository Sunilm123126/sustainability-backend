package com.example.demo.dto;

public class AIChatRequest {

    private String username;
    private String question;

    public AIChatRequest() {
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }public String getQuestion() {
        return question;
    }
    public void setQuestion(String question) {
        this.question = question;
    }
}