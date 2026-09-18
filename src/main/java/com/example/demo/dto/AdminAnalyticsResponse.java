package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class AdminAnalyticsResponse {

    private long totalUsers;
    private long totalActivities;

    private double totalEmissions;
    private double averageEcoScore;

    private List<DailyData> dailyData;
    private List<DailyData> weeklyData;
    private List<DailyData> monthlyData;
    private List<MonthlyData> yearlyData;

    private Map<String, Double> categoryData;

    private List<TopUser> topUsers;


    public AdminAnalyticsResponse(
            long totalUsers,
            long totalActivities,
            double totalEmissions,
            double averageEcoScore,
            List<DailyData> dailyData,
            List<DailyData> weeklyData,
            List<DailyData> monthlyData,
            List<MonthlyData> yearlyData,
            Map<String, Double> categoryData,
            List<TopUser> topUsers
    ) {

        this.totalUsers = totalUsers;
        this.totalActivities = totalActivities;
        this.totalEmissions = totalEmissions;
        this.averageEcoScore = averageEcoScore;

        this.dailyData = dailyData;
        this.weeklyData = weeklyData;
        this.monthlyData = monthlyData;
        this.yearlyData = yearlyData;

        this.categoryData = categoryData;
        this.topUsers = topUsers;
    }


    // =====================================================
    // GETTERS
    // =====================================================

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalActivities() {
        return totalActivities;
    }

    public double getTotalEmissions() {
        return totalEmissions;
    }

    public double getAverageEcoScore() {
        return averageEcoScore;
    }

    public List<DailyData> getDailyData() {
        return dailyData;
    }

    public List<DailyData> getWeeklyData() {
        return weeklyData;
    }

    public List<DailyData> getMonthlyData() {
        return monthlyData;
    }

    public List<MonthlyData> getYearlyData() {
        return yearlyData;
    }

    public Map<String, Double> getCategoryData() {
        return categoryData;
    }

    public List<TopUser> getTopUsers() {
        return topUsers;
    }


    // =====================================================
    // DAILY DATA
    // =====================================================

    public static class DailyData {

        private String day;
        private double emission;

        public DailyData(
                String day,
                double emission
        ) {

            this.day = day;
            this.emission = emission;
        }

        public String getDay() {
            return day;
        }

        public double getEmission() {
            return emission;
        }
    }


    // =====================================================
    // MONTHLY DATA
    // =====================================================

    public static class MonthlyData {

        private String month;
        private double emission;

        public MonthlyData(
                String month,
                double emission
        ) {

            this.month = month;
            this.emission = emission;
        }

        public String getMonth() {
            return month;
        }

        public double getEmission() {
            return emission;
        }
    }


    // =====================================================
    // TOP USER
    // =====================================================

    public static class TopUser {

        private String username;
        private long activities;
        private double emissions;

        public TopUser(
                String username,
                long activities,
                double emissions
        ) {

            this.username = username;
            this.activities = activities;
            this.emissions = emissions;
        }

        public String getUsername() {
            return username;
        }

        public long getActivities() {
            return activities;
        }

        public double getEmissions() {
            return emissions;
        }
    }
}