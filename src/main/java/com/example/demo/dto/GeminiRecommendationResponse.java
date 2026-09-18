package com.example.demo.dto;

public class GeminiRecommendationResponse {

    private String activity;
    private String category;
    private double amount;
    private String unit;
    private double emission;

    private String title;
    private String recommendation;
    private String action;
    private String priority;

    public GeminiRecommendationResponse() {
    }

    public GeminiRecommendationResponse(
            String activity,
            String category,
            double amount,
            String unit,
            double emission,
            String title,
            String recommendation,
            String action,
            String priority
    ) {
        this.activity = activity;
        this.category = category;
        this.amount = amount;
        this.unit = unit;
        this.emission = emission;
        this.title = title;
        this.recommendation = recommendation;
        this.action = action;
        this.priority = priority;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public double getEmission() {
        return emission;
    }

    public void setEmission(double emission) {
        this.emission = emission;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}