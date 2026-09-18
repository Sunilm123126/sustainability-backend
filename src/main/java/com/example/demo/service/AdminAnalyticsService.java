package com.example.demo.service;

import com.example.demo.dto.AdminAnalyticsResponse;
import com.example.demo.entity.Activity;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;


    public AdminAnalyticsService(
            ActivityRepository activityRepository,
            UserRepository userRepository
    ) {

        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }


    // =====================================================
    // MAIN ADMIN ANALYTICS
    // =====================================================

    public AdminAnalyticsResponse getAdminAnalytics() {

        List<Activity> activities =
                activityRepository.findAll();


        // =================================================
        // TOTAL USERS
        // =================================================

        long totalUsers =
                userRepository.count();


        // =================================================
        // TOTAL ACTIVITIES
        // =================================================

        long totalActivities =
                activities.size();


        // =================================================
        // TOTAL EMISSIONS
        // =================================================

        double totalEmissions =
                activities.stream()
                        .mapToDouble(activity ->
                                activity.getEmission() == null
                                        ? 0
                                        : activity.getEmission()
                        )
                        .sum();


        // =================================================
        // AVERAGE ECO SCORE
        // =================================================

        double averageEcoScore =
                calculateAverageEcoScore(
                        activities
                );


        // =================================================
        // DAILY DATA
        // =================================================

        List<AdminAnalyticsResponse.DailyData>
                dailyData =
                calculateDailyData(
                        activities
                );


        // =================================================
        // WEEKLY DATA
        // =================================================

        List<AdminAnalyticsResponse.DailyData>
                weeklyData =
                calculateWeeklyData(
                        activities
                );


        // =================================================
        // MONTHLY DATA
        // =================================================

        List<AdminAnalyticsResponse.DailyData>
                monthlyData =
                calculateMonthlyData(
                        activities
                );


        // =================================================
        // YEARLY DATA
        // =================================================

        List<AdminAnalyticsResponse.MonthlyData>
                yearlyData =
                calculateYearlyData(
                        activities
                );


        // =================================================
        // CATEGORY DATA
        // =================================================

        Map<String, Double> categoryData =
                calculateCategoryData(
                        activities
                );


        // =================================================
        // TOP USERS
        // =================================================

        List<AdminAnalyticsResponse.TopUser>
                topUsers =
                calculateTopUsers(
                        activities
                );


        return new AdminAnalyticsResponse(

                totalUsers,
                totalActivities,
                round(totalEmissions),
                round(averageEcoScore),

                dailyData,
                weeklyData,
                monthlyData,
                yearlyData,

                categoryData,
                topUsers
        );
    }


    // =====================================================
    // DAILY DATA
    // =====================================================

    private List<AdminAnalyticsResponse.DailyData>
    calculateDailyData(
            List<Activity> activities
    ) {

        LocalDate today =
                LocalDate.now();


        double todayEmission =
                activities.stream()
                        .filter(activity ->
                                activity.getCreatedAt() != null
                        )
                        .filter(activity ->
                                activity.getCreatedAt()
                                        .toLocalDate()
                                        .equals(today)
                        )
                        .mapToDouble(activity ->
                                activity.getEmission() == null
                                        ? 0
                                        : activity.getEmission()
                        )
                        .sum();


        List<AdminAnalyticsResponse.DailyData>
                result =
                new ArrayList<>();


        result.add(
                new AdminAnalyticsResponse.DailyData(
                        today.toString(),
                        round(todayEmission)
                )
        );


        return result;
    }


    // =====================================================
    // WEEKLY DATA
    // =====================================================

    private List<AdminAnalyticsResponse.DailyData>
    calculateWeeklyData(
            List<Activity> activities
    ) {

        LocalDate today =
                LocalDate.now();


        LocalDate monday =
                today.with(
                        DayOfWeek.MONDAY
                );


        List<AdminAnalyticsResponse.DailyData>
                result =
                new ArrayList<>();


        for (int i = 0; i < 7; i++) {

            LocalDate date =
                    monday.plusDays(i);


            double emission =
                    activities.stream()

                            .filter(activity ->
                                    activity.getCreatedAt() != null
                            )

                            .filter(activity ->
                                    activity.getCreatedAt()
                                            .toLocalDate()
                                            .equals(date)
                            )

                            .mapToDouble(activity ->
                                    activity.getEmission() == null
                                            ? 0
                                            : activity.getEmission()
                            )

                            .sum();


            result.add(
                    new AdminAnalyticsResponse.DailyData(

                            date.getDayOfWeek()
                                    .getDisplayName(
                                            TextStyle.SHORT,
                                            Locale.ENGLISH
                                    ),

                            round(emission)
                    )
            );
        }


        return result;
    }


    // =====================================================
    // MONTHLY DATA
    // =====================================================

    private List<AdminAnalyticsResponse.DailyData>
    calculateMonthlyData(
            List<Activity> activities
    ) {

        LocalDate today =
                LocalDate.now();


        LocalDate firstDay =
                today.withDayOfMonth(1);


        int daysInMonth =
                today.lengthOfMonth();


        List<AdminAnalyticsResponse.DailyData>
                result =
                new ArrayList<>();


        for (int i = 0; i < daysInMonth; i++) {

            LocalDate date =
                    firstDay.plusDays(i);


            double emission =
                    activities.stream()

                            .filter(activity ->
                                    activity.getCreatedAt() != null
                            )

                            .filter(activity ->
                                    activity.getCreatedAt()
                                            .toLocalDate()
                                            .equals(date)
                            )

                            .mapToDouble(activity ->
                                    activity.getEmission() == null
                                            ? 0
                                            : activity.getEmission()
                            )

                            .sum();


            result.add(
                    new AdminAnalyticsResponse.DailyData(

                            String.valueOf(
                                    date.getDayOfMonth()
                            ),

                            round(emission)
                    )
            );
        }


        return result;
    }


    // =====================================================
    // YEARLY DATA
    // =====================================================

    private List<AdminAnalyticsResponse.MonthlyData>
    calculateYearlyData(
            List<Activity> activities
    ) {

        int currentYear =
                LocalDate.now().getYear();


        List<AdminAnalyticsResponse.MonthlyData>
                result =
                new ArrayList<>();


        for (Month month : Month.values()) {

            double emission =
                    activities.stream()

                            .filter(activity ->
                                    activity.getCreatedAt() != null
                            )

                            .filter(activity ->
                                    activity.getCreatedAt()
                                            .getYear()
                                            == currentYear
                            )

                            .filter(activity ->
                                    activity.getCreatedAt()
                                            .getMonth()
                                            == month
                            )

                            .mapToDouble(activity ->
                                    activity.getEmission() == null
                                            ? 0
                                            : activity.getEmission()
                            )

                            .sum();


            result.add(
                    new AdminAnalyticsResponse.MonthlyData(

                            month.getDisplayName(
                                    TextStyle.SHORT,
                                    Locale.ENGLISH
                            ),

                            round(emission)
                    )
            );
        }


        return result;
    }


    // =====================================================
    // CATEGORY DATA
    // =====================================================

    private Map<String, Double>
    calculateCategoryData(
            List<Activity> activities
    ) {

        Map<String, Double> totals =
                new LinkedHashMap<>();


        for (Activity activity : activities) {

            String category =
                    activity.getCategory();


            if (category == null ||
                    category.isBlank()) {

                category = "Other";
            }


            double emission =
                    activity.getEmission() == null
                            ? 0
                            : activity.getEmission();


            totals.put(
                    category,
                    totals.getOrDefault(
                            category,
                            0.0
                    ) + emission
            );
        }


        return totals.entrySet()
                .stream()
                .collect(
                        Collectors.toMap(

                                Map.Entry::getKey,

                                entry ->
                                        round(
                                                entry.getValue()
                                        ),

                                (a, b) -> a,

                                LinkedHashMap::new
                        )
                );
    }


    // =====================================================
    // TOP USERS
    // =====================================================

    private List<AdminAnalyticsResponse.TopUser>
    calculateTopUsers(
            List<Activity> activities
    ) {

        Map<String, List<Activity>>
                groupedUsers =
                activities.stream()

                        .filter(activity ->
                                activity.getUsername() != null
                        )

                        .collect(
                                Collectors.groupingBy(
                                        Activity::getUsername
                                )
                        );


        List<AdminAnalyticsResponse.TopUser>
                result =
                new ArrayList<>();


        for (
                Map.Entry<String, List<Activity>> entry
                : groupedUsers.entrySet()
        ) {

            String username =
                    entry.getKey();


            List<Activity> userActivities =
                    entry.getValue();


            long activityCount =
                    userActivities.size();


            double emissions =
                    userActivities.stream()

                            .mapToDouble(activity ->
                                    activity.getEmission() == null
                                            ? 0
                                            : activity.getEmission()
                            )

                            .sum();


            result.add(
                    new AdminAnalyticsResponse.TopUser(

                            username,

                            activityCount,

                            round(emissions)
                    )
            );
        }


        return result.stream()

                .sorted(
                        (a, b) ->
                                Double.compare(
                                        b.getEmissions(),
                                        a.getEmissions()
                                )
                )

                .limit(10)

                .collect(
                        Collectors.toList()
                );
    }


    // =====================================================
    // AVERAGE ECO SCORE
    // =====================================================

    private double calculateAverageEcoScore(
            List<Activity> activities
    ) {

        if (activities.isEmpty()) {
            return 100.0;
        }


        Map<String, Double>
                userEmissions =
                activities.stream()

                        .filter(activity ->
                                activity.getUsername() != null
                        )

                        .collect(
                                Collectors.groupingBy(

                                        Activity::getUsername,

                                        Collectors.summingDouble(
                                                activity ->
                                                        activity.getEmission() == null
                                                                ? 0
                                                                : activity.getEmission()
                                        )
                                )
                        );


        if (userEmissions.isEmpty()) {
            return 100.0;
        }


        double totalScore = 0;


        for (double emission :
                userEmissions.values()) {

            totalScore +=
                    calculateEcoScore(
                            emission
                    );
        }


        return totalScore /
                userEmissions.size();
    }


    // =====================================================
    // ECO SCORE
    // =====================================================

    private double calculateEcoScore(
            double emission
    ) {

        /*
         * Lower emissions = higher score.
         *
         * This is a simple project-level
         * scoring system.
         */

        double score =
                100.0 -
                        (emission * 2.0);


        if (score < 0) {
            score = 0;
        }


        if (score > 100) {
            score = 100;
        }


        return score;
    }


    // =====================================================
    // ROUND
    // =====================================================

    private double round(
            double value
    ) {

        return Math.round(
                value * 100.0
        ) / 100.0;
    }
}