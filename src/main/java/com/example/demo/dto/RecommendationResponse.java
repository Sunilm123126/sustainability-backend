package com.example.demo.dto;

public class RecommendationResponse {

    private String category;
    private String title;
    private String message;
    private String priority;
    private double potentialReduction;

    public RecommendationResponse(
            String category,
            String title,
            String message,
            String priority,
            double potentialReduction
    ) {
        this.category = category;
        this.title = title;
        this.message = message;
        this.priority = priority;
        this.potentialReduction = potentialReduction;
    }

    // =====================================================
    // GETTERS
    // =====================================================

    public String getCategory() {
        return category;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getPriority() {
        return priority;
    }

    public double getPotentialReduction() {
        return potentialReduction;
    }


    // =====================================================
    // SETTERS
    // =====================================================

    public void setCategory(String category) {
        this.category = category;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setPotentialReduction(double potentialReduction) {
        this.potentialReduction = potentialReduction;
    }
}