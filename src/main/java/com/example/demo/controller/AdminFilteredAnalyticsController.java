package com.example.demo.controller;

import com.example.demo.entity.Activity;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminFilteredAnalyticsController {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public AdminFilteredAnalyticsController(
            ActivityRepository activityRepository,
            UserRepository userRepository
    ) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // SELECTED DATE / MONTH / YEAR ANALYTICS
    // =========================================================

    @GetMapping("/analytics/selected")
    public Map<String, Object> getSelectedAnalytics(

            @RequestParam String date,
            @RequestParam String month,
            @RequestParam int year

    ) {

        LocalDate selectedDate =
                LocalDate.parse(date);

        YearMonth selectedMonth =
                YearMonth.parse(month);


        // =====================================================
        // ALL ACTIVITIES
        // =====================================================

        List<Activity> allActivities =
                activityRepository.findAll();


        // =====================================================
        // SELECTED DATE
        // =====================================================

        LocalDateTime dateStart =
                selectedDate.atStartOfDay();

        LocalDateTime dateEnd =
                selectedDate.plusDays(1)
                        .atStartOfDay();


        List<Activity> dateActivities =
                allActivities.stream()
                        .filter(activity ->
                                activity.getCreatedAt() != null
                                        &&
                                        !activity.getCreatedAt()
                                                .isBefore(dateStart)
                                        &&
                                        activity.getCreatedAt()
                                                .isBefore(dateEnd)
                        )
                        .toList();


        double todayEmission =
                getTotalEmission(dateActivities);


        // =====================================================
        // SELECTED WEEK
        // MONDAY -> SUNDAY
        // =====================================================

        LocalDate weekStart =
                selectedDate.with(
                        DayOfWeek.MONDAY
                );

        LocalDate weekEnd =
                weekStart.plusDays(7);


        LocalDateTime weekStartDateTime =
                weekStart.atStartOfDay();

        LocalDateTime weekEndDateTime =
                weekEnd.atStartOfDay();


        List<Activity> weekActivities =
                allActivities.stream()
                        .filter(activity ->
                                activity.getCreatedAt() != null
                                        &&
                                        !activity.getCreatedAt()
                                                .isBefore(
                                                        weekStartDateTime
                                                )
                                        &&
                                        activity.getCreatedAt()
                                                .isBefore(
                                                        weekEndDateTime
                                                )
                        )
                        .toList();


        double weeklyEmission =
                getTotalEmission(
                        weekActivities
                );


        // =====================================================
        // SELECTED MONTH
        // =====================================================

        LocalDate monthStart =
                selectedMonth
                        .atDay(1);

        LocalDate monthEnd =
                selectedMonth
                        .plusMonths(1)
                        .atDay(1);


        LocalDateTime monthStartDateTime =
                monthStart.atStartOfDay();

        LocalDateTime monthEndDateTime =
                monthEnd.atStartOfDay();


        List<Activity> monthActivities =
                allActivities.stream()
                        .filter(activity ->
                                activity.getCreatedAt() != null
                                        &&
                                        !activity.getCreatedAt()
                                                .isBefore(
                                                        monthStartDateTime
                                                )
                                        &&
                                        activity.getCreatedAt()
                                                .isBefore(
                                                        monthEndDateTime
                                                )
                        )
                        .toList();


        double monthlyEmission =
                getTotalEmission(
                        monthActivities
                );


        // =====================================================
        // SELECTED YEAR
        // =====================================================

        LocalDate yearStart =
                LocalDate.of(
                        year,
                        1,
                        1
                );

        LocalDate yearEnd =
                LocalDate.of(
                        year + 1,
                        1,
                        1
                );


        LocalDateTime yearStartDateTime =
                yearStart.atStartOfDay();

        LocalDateTime yearEndDateTime =
                yearEnd.atStartOfDay();


        List<Activity> yearActivities =
                allActivities.stream()
                        .filter(activity ->
                                activity.getCreatedAt() != null
                                        &&
                                        !activity.getCreatedAt()
                                                .isBefore(
                                                        yearStartDateTime
                                                )
                                        &&
                                        activity.getCreatedAt()
                                                .isBefore(
                                                        yearEndDateTime
                                                )
                        )
                        .toList();


        double yearlyEmission =
                getTotalEmission(
                        yearActivities
                );


        // =====================================================
        // DAILY DATA
        // =====================================================

        List<Map<String, Object>> dailyData =
                new ArrayList<>();


        Map<String, Object> daily =
                new HashMap<>();

        daily.put(
                "day",
                selectedDate.toString()
        );

        daily.put(
                "emission",
                round(todayEmission)
        );

        dailyData.add(daily);


        // =====================================================
        // WEEKLY DATA
        // =====================================================

        List<Map<String, Object>> weeklyData =
                new ArrayList<>();


        for (int i = 0; i < 7; i++) {

            LocalDate currentDate =
                    weekStart.plusDays(i);


            LocalDateTime currentStart =
                    currentDate.atStartOfDay();

            LocalDateTime currentEnd =
                    currentDate.plusDays(1)
                            .atStartOfDay();


            double emission =
                    getTotalEmission(
                            allActivities.stream()
                                    .filter(activity ->
                                            activity.getCreatedAt() != null
                                                    &&
                                                    !activity.getCreatedAt()
                                                            .isBefore(
                                                                    currentStart
                                                            )
                                                    &&
                                                    activity.getCreatedAt()
                                                            .isBefore(
                                                                    currentEnd
                                                            )
                                    )
                                    .toList()
                    );


            Map<String, Object> item =
                    new HashMap<>();


            item.put(
                    "day",
                    currentDate
                            .getDayOfWeek()
                            .getDisplayName(
                                    TextStyle.SHORT,
                                    Locale.ENGLISH
                            )
                            .toUpperCase()
            );


            item.put(
                    "date",
                    currentDate.toString()
            );


            item.put(
                    "emission",
                    round(emission)
            );


            weeklyData.add(item);
        }


        // =====================================================
        // MONTHLY DATA
        // EVERY DAY OF SELECTED MONTH
        // =====================================================

        List<Map<String, Object>> monthlyData =
                new ArrayList<>();


        int daysInMonth =
                selectedMonth.lengthOfMonth();


        for (int day = 1;
             day <= daysInMonth;
             day++) {


            LocalDate currentDate =
                    selectedMonth.atDay(day);


            LocalDateTime currentStart =
                    currentDate.atStartOfDay();

            LocalDateTime currentEnd =
                    currentDate.plusDays(1)
                            .atStartOfDay();


            double emission =
                    getTotalEmission(
                            allActivities.stream()
                                    .filter(activity ->
                                            activity.getCreatedAt() != null
                                                    &&
                                                    !activity.getCreatedAt()
                                                            .isBefore(
                                                                    currentStart
                                                            )
                                                    &&
                                                    activity.getCreatedAt()
                                                            .isBefore(
                                                                    currentEnd
                                                            )
                                    )
                                    .toList()
                    );


            Map<String, Object> item =
                    new HashMap<>();


            item.put(
                    "day",
                    day
            );


            item.put(
                    "date",
                    currentDate.toString()
            );


            item.put(
                    "emission",
                    round(emission)
            );


            monthlyData.add(item);
        }


        // =====================================================
        // YEARLY DATA
        // JANUARY -> DECEMBER
        // =====================================================

        List<Map<String, Object>> yearlyData =
                new ArrayList<>();


        for (int monthNumber = 1;
             monthNumber <= 12;
             monthNumber++) {


            YearMonth currentMonth =
                    YearMonth.of(
                            year,
                            monthNumber
                    );


            LocalDate currentStart =
                    currentMonth.atDay(1);

            LocalDate currentEnd =
                    currentMonth
                            .plusMonths(1)
                            .atDay(1);


            LocalDateTime currentStartDateTime =
                    currentStart.atStartOfDay();

            LocalDateTime currentEndDateTime =
                    currentEnd.atStartOfDay();


            double emission =
                    getTotalEmission(
                            allActivities.stream()
                                    .filter(activity ->
                                            activity.getCreatedAt() != null
                                                    &&
                                                    !activity.getCreatedAt()
                                                            .isBefore(
                                                                    currentStartDateTime
                                                            )
                                                    &&
                                                    activity.getCreatedAt()
                                                            .isBefore(
                                                                    currentEndDateTime
                                                            )
                                    )
                                    .toList()
                    );


            Map<String, Object> item =
                    new HashMap<>();


            item.put(
                    "month",
                    currentMonth
                            .getMonth()
                            .getDisplayName(
                                    TextStyle.SHORT,
                                    Locale.ENGLISH
                            )
            );


            item.put(
                    "monthNumber",
                    monthNumber
            );


            item.put(
                    "emission",
                    round(emission)
            );


            yearlyData.add(item);
        }


        // =====================================================
        // CATEGORY DATA
        // SELECTED MONTH
        // =====================================================

        Map<String, Double> categoryMap =
                new LinkedHashMap<>();


        categoryMap.put(
                "Transport",
                0.0
        );

        categoryMap.put(
                "Electricity",
                0.0
        );

        categoryMap.put(
                "Food",
                0.0
        );

        categoryMap.put(
                "Shopping",
                0.0
        );


        for (Activity activity :
                monthActivities) {


            String category =
                    activity.getCategory();


            if (category == null) {
                continue;
            }


            String normalized =
                    normalizeCategory(
                            category
                    );


            double emission =
                    activity.getEmission() == null
                            ? 0
                            : activity.getEmission();


            categoryMap.put(
                    normalized,
                    categoryMap.getOrDefault(
                            normalized,
                            0.0
                    ) + emission
            );
        }


        Map<String, Double> roundedCategory =
                new LinkedHashMap<>();


        for (
                Map.Entry<String, Double> entry :
                categoryMap.entrySet()
        ) {

            roundedCategory.put(
                    entry.getKey(),
                    round(entry.getValue())
            );

        }


        // =====================================================
        // TOP USERS
        // SELECTED MONTH
        // =====================================================

        Map<String, List<Activity>> userActivities =
                monthActivities.stream()
                        .filter(activity ->
                                activity.getUsername() != null
                        )
                        .collect(
                                Collectors.groupingBy(
                                        Activity::getUsername
                                )
                        );


        List<Map<String, Object>> topUsers =
                new ArrayList<>();


        for (
                Map.Entry<String, List<Activity>> entry :
                userActivities.entrySet()
        ) {

            String username =
                    entry.getKey();


            List<Activity> activities =
                    entry.getValue();


            double emission =
                    getTotalEmission(
                            activities
                    );


            Map<String, Object> user =
                    new HashMap<>();


            user.put(
                    "username",
                    username
            );


            user.put(
                    "activities",
                    activities.size()
            );


            user.put(
                    "emissions",
                    round(emission)
            );


            topUsers.add(user);
        }


        // Highest emission first
        topUsers.sort(
                (a, b) ->
                        Double.compare(
                                ((Number)
                                        b.get("emissions"))
                                        .doubleValue(),

                                ((Number)
                                        a.get("emissions"))
                                        .doubleValue()
                        )
        );


        // =====================================================
        // SELECTED DATE ACTIVITIES
        // =====================================================

        List<Map<String, Object>>
                selectedDateActivities =
                new ArrayList<>();


        for (
                Activity activity :
                dateActivities
        ) {

            Map<String, Object> item =
                    new HashMap<>();


            item.put(
                    "id",
                    activity.getId()
            );


            item.put(
                    "username",
                    activity.getUsername()
            );


            item.put(
                    "activity",
                    activity.getActivity()
            );


            item.put(
                    "category",
                    activity.getCategory()
            );


            item.put(
                    "amount",
                    activity.getAmount()
            );


            item.put(
                    "unit",
                    activity.getUnit()
            );


            item.put(
                    "emission",
                    round(
                            activity.getEmission() == null
                                    ? 0
                                    : activity.getEmission()
                    )
            );


            selectedDateActivities.add(item);
        }


        // =====================================================
        // RESPONSE
        // =====================================================

        Map<String, Object> response =
                new LinkedHashMap<>();


        response.put(
                "selectedDate",
                selectedDate.toString()
        );


        response.put(
                "selectedMonth",
                selectedMonth.toString()
        );


        response.put(
                "selectedYear",
                year
        );


        response.put(
                "todayEmission",
                round(todayEmission)
        );


        response.put(
                "weeklyEmission",
                round(weeklyEmission)
        );


        response.put(
                "monthlyEmission",
                round(monthlyEmission)
        );


        response.put(
                "yearlyEmission",
                round(yearlyEmission)
        );


        response.put(
                "dailyData",
                dailyData
        );


        response.put(
                "weeklyData",
                weeklyData
        );


        response.put(
                "monthlyData",
                monthlyData
        );


        response.put(
                "yearlyData",
                yearlyData
        );


        response.put(
                "categoryData",
                roundedCategory
        );


        response.put(
                "topUsers",
                topUsers
        );


        response.put(
                "selectedDateActivities",
                selectedDateActivities
        );


        // These are still useful for the admin page.
        response.put(
                "totalUsers",
                userRepository.findAll().size()
        );


        response.put(
                "totalActivities",
                monthActivities.size()
        );


        response.put(
                "totalEmissions",
                round(monthlyEmission)
        );


        return response;
    }


    // =========================================================
    // TOTAL EMISSION
    // =========================================================

    private double getTotalEmission(
            List<Activity> activities
    ) {

        return activities.stream()
                .mapToDouble(activity ->
                        activity.getEmission() == null
                                ? 0
                                : activity.getEmission()
                )
                .sum();

    }


    // =========================================================
    // CATEGORY NORMALIZATION
    // =========================================================

    private String normalizeCategory(
            String category
    ) {

        String value =
                category
                        .trim()
                        .toLowerCase();


        if (value.contains("transport")) {
            return "Transport";
        }


        if (value.contains("electric")) {
            return "Electricity";
        }


        if (value.contains("food")) {
            return "Food";
        }


        if (value.contains("shop")) {
            return "Shopping";
        }


        // Unknown categories
        // are grouped under Shopping
        // only if your existing database
        // uses unexpected names.
        return "Shopping";
    }


    // =========================================================
    // ROUND
    // =========================================================

    private double round(
            double value
    ) {

        return Math.round(
                value * 100.0
        ) / 100.0;

    }
}