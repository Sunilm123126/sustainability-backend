package com.example.demo.service;

import com.example.demo.dto.DashboardResponse;
import com.example.demo.entity.Activity;
import com.example.demo.repository.ActivityRepository;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ActivityRepository activityRepository;

    public AnalyticsService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }


    /* =========================================================
       MAIN DASHBOARD
    ========================================================= */

    public DashboardResponse getDashboard(String username) {

        LocalDate today = LocalDate.now();


        /* =====================================================
           WEEK
           Monday -> Sunday
        ===================================================== */

        LocalDate weekStart =
                today.with(DayOfWeek.MONDAY);

        LocalDate weekEnd =
                weekStart.plusDays(6);


        /* =====================================================
           MONTH
        ===================================================== */

        LocalDate monthStart =
                today.withDayOfMonth(1);

        LocalDate nextMonthStart =
                monthStart.plusMonths(1);


        /* =====================================================
           YEAR
        ===================================================== */

        LocalDate yearStart =
                LocalDate.of(
                        today.getYear(),
                        1,
                        1
                );

        LocalDate nextYearStart =
                yearStart.plusYears(1);


        /* =====================================================
           GET USER ACTIVITIES
        ===================================================== */

        List<Activity> activities =
                activityRepository.findByUsername(username);


        /* =====================================================
           TODAY EMISSION
        ===================================================== */

        double todayEmission =
                sumEmission(
                        activities,
                        today,
                        today.plusDays(1)
                );


        /* =====================================================
           WEEKLY EMISSION
        ===================================================== */

        double weeklyEmission =
                sumEmission(
                        activities,
                        weekStart,
                        weekEnd.plusDays(1)
                );


        /* =====================================================
           MONTHLY EMISSION
        ===================================================== */

        double monthlyEmission =
                sumEmission(
                        activities,
                        monthStart,
                        nextMonthStart
                );


        /* =====================================================
           YEARLY EMISSION
        ===================================================== */

        double yearlyEmission =
                sumEmission(
                        activities,
                        yearStart,
                        nextYearStart
                );


        /* =====================================================
           ECO SCORE
        ===================================================== */

        double ecoScore =
                calculateEcoScore(
                        monthlyEmission
                );


        /* =====================================================
           CATEGORY DATA
           Current month
        ===================================================== */

        Map<String, Double> categoryData =
                buildCategoryData(
                        activities,
                        monthStart,
                        nextMonthStart
                );


        /* =====================================================
           DAILY DATA
           Current month
        ===================================================== */

        List<DashboardResponse.DailyEmission>
                dailyData =
                buildDailyData(
                        activities,
                        monthStart,
                        nextMonthStart
                );


        /* =====================================================
           WEEKLY DATA
           EXACTLY 7 DAYS

           MON
           TUE
           WED
           THU
           FRI
           SAT
           SUN
        ===================================================== */

        List<DashboardResponse.DailyEmission>
                weeklyData =
                buildWeeklyData(
                        activities,
                        weekStart
                );


        /* =====================================================
           MONTHLY DATA
           1 -> 28/29/30/31
        ===================================================== */

        List<DashboardResponse.DailyEmission>
                monthlyData =
                buildMonthlyData(
                        activities,
                        monthStart
                );


        /* =====================================================
           YEARLY DATA
           JAN -> DEC
        ===================================================== */

        List<DashboardResponse.MonthlyEmission>
                yearlyData =
                buildYearlyData(
                        activities,
                        today.getYear()
                );


        /* =====================================================
           RECENT ACTIVITIES
        ===================================================== */

        List<Activity> recent =
                activities.stream()
                        .filter(
                                activity ->
                                        activity.getCreatedAt() != null
                        )
                        .sorted(
                                (a, b) ->
                                        b.getCreatedAt()
                                                .compareTo(
                                                        a.getCreatedAt()
                                                )
                        )
                        .limit(10)
                        .collect(Collectors.toList());


        List<DashboardResponse.RecentActivity>
                recentActivities =
                convertRecentActivities(
                        recent
                );


        /* =====================================================
           RETURN DASHBOARD
        ===================================================== */

        return new DashboardResponse(

                username,

                round(todayEmission),

                round(weeklyEmission),

                round(monthlyEmission),

                round(yearlyEmission),

                round(ecoScore),

                categoryData,

                dailyData,

                weeklyData,

                monthlyData,

                yearlyData,

                recentActivities,

                new ArrayList<>()
        );
    }


    /* =========================================================
       SELECTED ANALYTICS
    ========================================================= */

    public DashboardResponse getSelectedDashboard(

            String username,

            LocalDate selectedDate,

            String selectedMonth,

            int selectedYear

    ) {


        /* =====================================================
           GET USER ACTIVITIES
        ===================================================== */

        List<Activity> activities =
                activityRepository.findByUsername(username);


        /* =====================================================
           SELECTED MONTH
        ===================================================== */

        YearMonth yearMonth =
                YearMonth.parse(
                        selectedMonth
                );


        LocalDate monthStart =
                yearMonth.atDay(1);


        LocalDate nextMonthStart =
                yearMonth.plusMonths(1)
                        .atDay(1);


        /* =====================================================
           SELECTED YEAR
        ===================================================== */

        LocalDate yearStart =
                LocalDate.of(
                        selectedYear,
                        1,
                        1
                );


        LocalDate nextYearStart =
                yearStart.plusYears(1);


        /* =====================================================
           SELECTED DATE EMISSION
        ===================================================== */

        double selectedDateEmission =
                sumEmission(
                        activities,
                        selectedDate,
                        selectedDate.plusDays(1)
                );


        /* =====================================================
           SELECTED WEEK

           Monday -> Sunday
        ===================================================== */

        LocalDate selectedWeekStart =
                selectedDate.with(
                        DayOfWeek.MONDAY
                );


        LocalDate selectedWeekEnd =
                selectedWeekStart.plusDays(6);


        double selectedWeekEmission =
                sumEmission(
                        activities,
                        selectedWeekStart,
                        selectedWeekEnd.plusDays(1)
                );


        /* =====================================================
           SELECTED MONTH EMISSION
        ===================================================== */

        double selectedMonthEmission =
                sumEmission(
                        activities,
                        monthStart,
                        nextMonthStart
                );


        /* =====================================================
           SELECTED YEAR EMISSION
        ===================================================== */

        double selectedYearEmission =
                sumEmission(
                        activities,
                        yearStart,
                        nextYearStart
                );


        /* =====================================================
           ECO SCORE
        ===================================================== */

        double ecoScore =
                calculateEcoScore(
                        selectedMonthEmission
                );


        /* =====================================================
           CATEGORY DATA
           Selected month
        ===================================================== */

        Map<String, Double> categoryData =
                buildCategoryData(
                        activities,
                        monthStart,
                        nextMonthStart
                );


        /* =====================================================
           SELECTED DATE DATA

           ONLY ONE VALUE
        ===================================================== */

        List<DashboardResponse.DailyEmission>
                selectedDateData =
                new ArrayList<>();


        DashboardResponse.DailyEmission
                selectedDay =
                new DashboardResponse.DailyEmission(
                        selectedDate.toString(),
                        round(selectedDateEmission)
                );


        selectedDateData.add(
                selectedDay
        );


        /* =====================================================
           SELECTED WEEK DATA

           EXACTLY 7 VALUES
        ===================================================== */

        List<DashboardResponse.DailyEmission>
                selectedWeekData =
                buildWeeklyData(
                        activities,
                        selectedWeekStart
                );


        /* =====================================================
           SELECTED MONTH DATA

           1 -> 28/29/30/31
        ===================================================== */

        List<DashboardResponse.DailyEmission>
                selectedMonthData =
                buildMonthlyData(
                        activities,
                        monthStart
                );


        /* =====================================================
           SELECTED YEAR DATA

           JAN -> DEC
        ===================================================== */

        List<DashboardResponse.MonthlyEmission>
                selectedYearData =
                buildYearlyData(
                        activities,
                        selectedYear
                );


        /* =====================================================
           ACTIVITIES ON SELECTED DATE
        ===================================================== */

        List<Activity> selectedActivities =
                activities.stream()
                        .filter(
                                activity ->
                                        activity.getCreatedAt() != null
                                                &&
                                                activity.getCreatedAt()
                                                        .toLocalDate()
                                                        .equals(
                                                                selectedDate
                                                        )
                        )
                        .sorted(
                                (a, b) ->
                                        b.getCreatedAt()
                                                .compareTo(
                                                        a.getCreatedAt()
                                                )
                        )
                        .collect(Collectors.toList());


        List<DashboardResponse.RecentActivity>
                selectedDateActivities =
                convertRecentActivities(
                        selectedActivities
                );


        /* =====================================================
           RECENT ACTIVITIES
        ===================================================== */

        List<Activity> recent =
                activities.stream()
                        .filter(
                                activity ->
                                        activity.getCreatedAt() != null
                        )
                        .sorted(
                                (a, b) ->
                                        b.getCreatedAt()
                                                .compareTo(
                                                        a.getCreatedAt()
                                                )
                        )
                        .limit(10)
                        .collect(Collectors.toList());


        List<DashboardResponse.RecentActivity>
                recentActivities =
                convertRecentActivities(
                        recent
                );


        /* =====================================================
           RETURN SELECTED ANALYTICS
        ===================================================== */

        return new DashboardResponse(

                username,

                round(selectedDateEmission),

                round(selectedWeekEmission),

                round(selectedMonthEmission),

                round(selectedYearEmission),

                round(ecoScore),

                categoryData,

                selectedDateData,

                selectedWeekData,

                selectedMonthData,

                selectedYearData,

                recentActivities,

                selectedDateActivities
        );
    }


    /* =========================================================
       SUM EMISSION
    ========================================================= */

    private double sumEmission(

            List<Activity> activities,

            LocalDate start,

            LocalDate endExclusive

    ) {

        return activities.stream()

                .filter(
                        activity ->
                                activity.getCreatedAt() != null
                )

                .filter(
                        activity -> {

                            LocalDate date =
                                    activity.getCreatedAt()
                                            .toLocalDate();

                            return !date.isBefore(start)
                                    &&
                                    date.isBefore(
                                            endExclusive
                                    );
                        }
                )

                .mapToDouble(
                        activity -> {

                            Double emission =
                                    activity.getEmission();

                            return emission != null
                                    ? emission
                                    : 0.0;
                        }
                )

                .sum();
    }


    /* =========================================================
       DAILY DATA

       Current month
    ========================================================= */

    private List<DashboardResponse.DailyEmission>
    buildDailyData(

            List<Activity> activities,

            LocalDate start,

            LocalDate endExclusive

    ) {

        List<DashboardResponse.DailyEmission>
                result =
                new ArrayList<>();


        LocalDate date =
                start;


        while (
                date.isBefore(
                        endExclusive
                )
        ) {

            double emission =
                    sumEmission(
                            activities,
                            date,
                            date.plusDays(1)
                    );


            DashboardResponse.DailyEmission
                    item =
                    new DashboardResponse.DailyEmission(

                            String.valueOf(
                                    date.getDayOfMonth()
                            ),

                            round(emission)
                    );


            result.add(item);


            date =
                    date.plusDays(1);
        }


        return result;
    }


    /* =========================================================
       WEEKLY DATA

       EXACTLY 7 DAYS

       MON -> SUN
    ========================================================= */

    private List<DashboardResponse.DailyEmission>
    buildWeeklyData(

            List<Activity> activities,

            LocalDate weekStart

    ) {

        List<DashboardResponse.DailyEmission>
                result =
                new ArrayList<>();


        for (
                int i = 0;
                i < 7;
                i++
        ) {

            LocalDate date =
                    weekStart.plusDays(i);


            double emission =
                    sumEmission(
                            activities,
                            date,
                            date.plusDays(1)
                    );


            String day =
                    date.getDayOfWeek()
                            .toString()
                            .substring(
                                    0,
                                    3
                            );


            DashboardResponse.DailyEmission
                    item =
                    new DashboardResponse.DailyEmission(

                            day,

                            round(emission)
                    );


            result.add(item);
        }


        return result;
    }


    /* =========================================================
       MONTHLY DATA

       1 -> 28/29/30/31
    ========================================================= */

    private List<DashboardResponse.DailyEmission>
    buildMonthlyData(

            List<Activity> activities,

            LocalDate monthStart

    ) {

        List<DashboardResponse.DailyEmission>
                result =
                new ArrayList<>();


        int daysInMonth =
                monthStart.lengthOfMonth();


        for (
                int day = 1;
                day <= daysInMonth;
                day++
        ) {

            LocalDate date =
                    monthStart.withDayOfMonth(
                            day
                    );


            double emission =
                    sumEmission(
                            activities,
                            date,
                            date.plusDays(1)
                    );


            DashboardResponse.DailyEmission
                    item =
                    new DashboardResponse.DailyEmission(

                            String.valueOf(day),

                            round(emission)
                    );


            result.add(item);
        }


        return result;
    }


    /* =========================================================
       YEARLY DATA

       JAN -> DEC
    ========================================================= */

    private List<DashboardResponse.MonthlyEmission>
    buildYearlyData(

            List<Activity> activities,

            int year

    ) {

        List<DashboardResponse.MonthlyEmission>
                result =
                new ArrayList<>();


        for (
                Month month :
                Month.values()
        ) {

            LocalDate monthStart =
                    LocalDate.of(
                            year,
                            month,
                            1
                    );


            LocalDate nextMonth =
                    monthStart.plusMonths(1);


            double emission =
                    sumEmission(
                            activities,
                            monthStart,
                            nextMonth
                    );


            String monthName =
                    month.toString()
                            .substring(
                                    0,
                                    3
                            );


            DashboardResponse.MonthlyEmission
                    item =
                    new DashboardResponse.MonthlyEmission(

                            monthName,

                            round(emission)
                    );


            result.add(item);
        }


        return result;
    }


    /* =========================================================
       CATEGORY DATA

       Selected/current month
    ========================================================= */

    private Map<String, Double>
    buildCategoryData(

            List<Activity> activities,

            LocalDate start,

            LocalDate endExclusive

    ) {

        Map<String, Double>
                categoryData =
                new LinkedHashMap<>();


        activities.stream()

                .filter(
                        activity ->
                                activity.getCreatedAt() != null
                )

                .filter(
                        activity -> {

                            LocalDate date =
                                    activity.getCreatedAt()
                                            .toLocalDate();

                            return !date.isBefore(start)
                                    &&
                                    date.isBefore(
                                            endExclusive
                                    );
                        }
                )

                .forEach(
                        activity -> {

                            String category =
                                    activity.getCategory();


                            if (
                                    category == null
                                            ||
                                            category.trim().isEmpty()
                            ) {

                                category =
                                        "Other";
                            }


                            double emission =
                                    activity.getEmission() != null
                                            ? activity.getEmission()
                                            : 0.0;


                            categoryData.merge(
                                    category,
                                    emission,
                                    Double::sum
                            );
                        }
                );


        return categoryData;
    }


    /* =========================================================
       RECENT ACTIVITIES

       Convert Activity -> RecentActivity
    ========================================================= */

    private List<DashboardResponse.RecentActivity>
    convertRecentActivities(

            List<Activity> activities

    ) {

        List<DashboardResponse.RecentActivity>
                result =
                new ArrayList<>();


        for (
                Activity activity :
                activities
        ) {

            double amount =
                    activity.getAmount() != null
                            ? activity.getAmount()
                            : 0.0;


            double emission =
                    activity.getEmission() != null
                            ? activity.getEmission()
                            : 0.0;


            DashboardResponse.RecentActivity
                    item =
                    new DashboardResponse.RecentActivity(

                            activity.getActivity(),

                            activity.getCategory(),

                            amount,

                            activity.getUnit(),

                            emission
                    );


            result.add(item);
        }


        return result;
    }


    /* =========================================================
       ECO SCORE
    ========================================================= */

    private double calculateEcoScore(
            double monthlyEmission
    ) {

        /*
         * Current formula:
         *
         * 0 kg    -> 100
         * 50 kg   -> 75
         * 100 kg  -> 50
         * 200 kg+ -> 0
         */

        double score =
                100.0 -
                        (
                                monthlyEmission * 0.5
                        );


        if (score < 0) {
            score = 0;
        }


        if (score > 100) {
            score = 100;
        }


        return score;
    }


    /* =========================================================
       ROUND
    ========================================================= */

    private double round(
            double value
    ) {

        return Math.round(
                value * 100.0
        ) / 100.0;
    }
}