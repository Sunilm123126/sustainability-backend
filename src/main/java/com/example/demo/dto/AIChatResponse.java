package com.example.demo.dto;

public class AIChatResponse {

    private String response;

    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public AIChatResponse() {
    }

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AIChatResponse(String response) {
        this.response = response;
    }

    // =========================================================
    // GET RESPONSE
    // =========================================================

    public String getResponse() {
        return response;
    }

    // =========================================================
    // SET RESPONSE
    // =========================================================

    public void setResponse(String response) {
        this.response = response;
    }
}