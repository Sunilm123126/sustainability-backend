package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class DashboardResponse {

    private String username;

    // Summary values
    private double todayEmission;
    private double weeklyEmission;
    private double monthlyEmission;
    private double yearlyEmission;
    private double ecoScore;

    // Category percentage breakdown
    private Map<String, Double> categoryData;

    // Different analytics graphs
    private List<DailyEmission> dailyData;
    private List<DailyEmission> weeklyData;
    private List<DailyEmission> monthlyData;
    private List<MonthlyEmission> yearlyData;

    // Activities for a particular date
    private List<RecentActivity> recentActivities;
    private List<RecentActivity> selectedDateActivities;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public DashboardResponse(
            String username,
            double todayEmission,
            double weeklyEmission,
            double monthlyEmission,
            double yearlyEmission,
            double ecoScore,
            Map<String, Double> categoryData,
            List<DailyEmission> dailyData,
            List<DailyEmission> weeklyData,
            List<DailyEmission> monthlyData,
            List<MonthlyEmission> yearlyData,
            List<RecentActivity> recentActivities,
            List<RecentActivity> selectedDateActivities
    ) {

        this.username = username;

        this.todayEmission = todayEmission;
        this.weeklyEmission = weeklyEmission;
        this.monthlyEmission = monthlyEmission;
        this.yearlyEmission = yearlyEmission;

        this.ecoScore = ecoScore;

        this.categoryData = categoryData;

        this.dailyData = dailyData;
        this.weeklyData = weeklyData;
        this.monthlyData = monthlyData;
        this.yearlyData = yearlyData;

        this.recentActivities = recentActivities;
        this.selectedDateActivities = selectedDateActivities;
    }


    // =========================================================
    // GETTERS
    // =========================================================

    public String getUsername() {
        return username;
    }

    public double getTodayEmission() {
        return todayEmission;
    }

    public double getWeeklyEmission() {
        return weeklyEmission;
    }

    public double getMonthlyEmission() {
        return monthlyEmission;
    }

    public double getYearlyEmission() {
        return yearlyEmission;
    }

    public double getEcoScore() {
        return ecoScore;
    }

    public Map<String, Double> getCategoryData() {
        return categoryData;
    }

    public List<DailyEmission> getDailyData() {
        return dailyData;
    }

    public List<DailyEmission> getWeeklyData() {
        return weeklyData;
    }

    public List<DailyEmission> getMonthlyData() {
        return monthlyData;
    }

    public List<MonthlyEmission> getYearlyData() {
        return yearlyData;
    }

    public List<RecentActivity> getRecentActivities() {
        return recentActivities;
    }

    public List<RecentActivity> getSelectedDateActivities() {
        return selectedDateActivities;
    }


    // =========================================================
    // DAILY EMISSION
    // Used for:
    // Daily / Particular Date / Monthly graph
    // =========================================================

    public static class DailyEmission {

        private String day;
        private double emission;


        public DailyEmission(
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


    // =========================================================
    // MONTHLY EMISSION
    // Used for YEARLY graph
    // =========================================================

    public static class MonthlyEmission {

        private String month;
        private double emission;


        public MonthlyEmission(
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


    // =========================================================
    // RECENT ACTIVITY
    // =========================================================

    public static class RecentActivity {

        private String activity;
        private String category;
        private double amount;
        private String unit;
        private double emission;


        public RecentActivity(
                String activity,
                String category,
                double amount,
                String unit,
                double emission
        ) {

            this.activity = activity;
            this.category = category;
            this.amount = amount;
            this.unit = unit;
            this.emission = emission;
        }


        public String getActivity() {
            return activity;
        }

        public String getCategory() {
            return category;
        }

        public double getAmount() {
            return amount;
        }

        public String getUnit() {
            return unit;
        }

        public double getEmission() {
            return emission;
        }
    }
}