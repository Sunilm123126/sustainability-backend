package com.example.demo.controller;

import com.example.demo.entity.Activity;
import com.example.demo.entity.OrganizationMember;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.OrganizationMemberRepository;
import com.example.demo.repository.OrganizationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "http://localhost:5173")
public class OrganizationAnalyticsController {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository memberRepository;
    private final ActivityRepository activityRepository;


    public OrganizationAnalyticsController(
            OrganizationRepository organizationRepository,
            OrganizationMemberRepository memberRepository,
            ActivityRepository activityRepository
    ) {

        this.organizationRepository = organizationRepository;
        this.memberRepository = memberRepository;
        this.activityRepository = activityRepository;

    }


    // =====================================================
    // ORGANIZATION ANALYTICS
    // =====================================================

    @GetMapping("/{organizationId}/analytics")
    public ResponseEntity<?> getAnalytics(
            @PathVariable Long organizationId
    ) {

        try {

            // -------------------------------------------------
            // CHECK ORGANIZATION
            // -------------------------------------------------

            organizationRepository
                    .findById(organizationId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Organization not found"
                            )
                    );


            // -------------------------------------------------
            // FIND MEMBERS
            // -------------------------------------------------

            List<OrganizationMember> members =
                    memberRepository
                            .findByOrganization_Id(
                                    organizationId
                            );


            // -------------------------------------------------
            // ONLY ACTIVE MEMBERS
            // -------------------------------------------------

            List<OrganizationMember> activeMembers =
                    members.stream()
                            .filter(member ->
                                    "ACTIVE".equalsIgnoreCase(
                                            member.getStatus()
                                    )
                            )
                            .toList();


            // -------------------------------------------------
            // USERNAMES
            // -------------------------------------------------

            Set<String> usernames =
                    new HashSet<>();


            for (
                    OrganizationMember member :
                    activeMembers
            ) {

                if (
                        member.getUser() != null &&
                                member.getUser().getUsername() != null
                ) {

                    usernames.add(
                            member.getUser().getUsername()
                    );

                }

            }


            // -------------------------------------------------
            // ALL ACTIVITIES
            // -------------------------------------------------

            List<Activity> allActivities =
                    activityRepository.findAll();


            List<Activity> organizationActivities =
                    allActivities.stream()
                            .filter(activity ->
                                    activity.getUsername() != null &&
                                            usernames.contains(
                                                    activity.getUsername()
                                            )
                            )
                            .toList();


            // -------------------------------------------------
            // DATES
            // -------------------------------------------------

            LocalDate today =
                    LocalDate.now();

            LocalDateTime todayStart =
                    today.atStartOfDay();

            LocalDateTime tomorrowStart =
                    today.plusDays(1)
                            .atStartOfDay();


            LocalDate weekStart =
                    today.with(
                            DayOfWeek.MONDAY
                    );

            LocalDate weekEnd =
                    weekStart.plusDays(7);


            LocalDateTime weekStartTime =
                    weekStart.atStartOfDay();

            LocalDateTime weekEndTime =
                    weekEnd.atStartOfDay();


            YearMonth currentMonth =
                    YearMonth.now();


            LocalDateTime monthStart =
                    currentMonth
                            .atDay(1)
                            .atStartOfDay();


            LocalDateTime nextMonthStart =
                    currentMonth
                            .plusMonths(1)
                            .atDay(1)
                            .atStartOfDay();


            LocalDateTime yearStart =
                    LocalDate.of(
                            today.getYear(),
                            1,
                            1
                    ).atStartOfDay();


            LocalDateTime nextYearStart =
                    LocalDate.of(
                            today.getYear() + 1,
                            1,
                            1
                    ).atStartOfDay();


            // -------------------------------------------------
            // FILTER ACTIVITIES
            // -------------------------------------------------

            List<Activity> todayActivities =
                    filterActivities(
                            organizationActivities,
                            todayStart,
                            tomorrowStart
                    );


            List<Activity> weekActivities =
                    filterActivities(
                            organizationActivities,
                            weekStartTime,
                            weekEndTime
                    );


            List<Activity> monthActivities =
                    filterActivities(
                            organizationActivities,
                            monthStart,
                            nextMonthStart
                    );


            List<Activity> yearActivities =
                    filterActivities(
                            organizationActivities,
                            yearStart,
                            nextYearStart
                    );


            // -------------------------------------------------
            // EMISSIONS
            // -------------------------------------------------

            double todayEmission =
                    calculateEmission(
                            todayActivities
                    );


            double weeklyEmission =
                    calculateEmission(
                            weekActivities
                    );


            double monthlyEmission =
                    calculateEmission(
                            monthActivities
                    );


            double yearlyEmission =
                    calculateEmission(
                            yearActivities
                    );


            double averageEmission =
                    activeMembers.isEmpty()
                            ? 0
                            : monthlyEmission /
                            activeMembers.size();


            // -------------------------------------------------
            // CATEGORY DATA
            // -------------------------------------------------

            Map<String, Double> categoryData =
                    new LinkedHashMap<>();


            categoryData.put(
                    "Transport",
                    0.0
            );

            categoryData.put(
                    "Electricity",
                    0.0
            );

            categoryData.put(
                    "Food",
                    0.0
            );

            categoryData.put(
                    "Shopping",
                    0.0
            );


            for (
                    Activity activity :
                    monthActivities
            ) {

                String category =
                        normalizeCategory(
                                activity.getCategory()
                        );


                double emission =
                        activity.getEmission() == null
                                ? 0
                                : activity.getEmission();


                categoryData.put(
                        category,
                        categoryData.getOrDefault(
                                category,
                                0.0
                        ) + emission
                );

            }


            // -------------------------------------------------
            // DAILY TREND
            // -------------------------------------------------

            List<Map<String, Object>> dailyTrend =
                    new ArrayList<>();


            int daysInMonth =
                    currentMonth.lengthOfMonth();


            for (
                    int day = 1;
                    day <= daysInMonth;
                    day++
            ) {

                LocalDate date =
                        currentMonth.atDay(day);


                LocalDateTime start =
                        date.atStartOfDay();

                LocalDateTime end =
                        date.plusDays(1)
                                .atStartOfDay();


                double emission =
                        calculateEmission(
                                filterActivities(
                                        organizationActivities,
                                        start,
                                        end
                                )
                        );


                Map<String, Object> item =
                        new LinkedHashMap<>();


                item.put(
                        "day",
                        String.valueOf(day)
                );

                item.put(
                        "emission",
                        emission
                );


                dailyTrend.add(item);

            }


            // -------------------------------------------------
            // WEEKLY TREND
            // -------------------------------------------------

            List<Map<String, Object>> weeklyTrend =
                    new ArrayList<>();


            for (
                    int i = 0;
                    i < 7;
                    i++
            ) {

                LocalDate date =
                        weekStart.plusDays(i);


                LocalDateTime start =
                        date.atStartOfDay();

                LocalDateTime end =
                        date.plusDays(1)
                                .atStartOfDay();


                double emission =
                        calculateEmission(
                                filterActivities(
                                        organizationActivities,
                                        start,
                                        end
                                )
                        );


                Map<String, Object> item =
                        new LinkedHashMap<>();


                item.put(
                        "day",
                        date.getDayOfWeek()
                                .toString()
                                .substring(0, 3)
                );

                item.put(
                        "emission",
                        emission
                );


                weeklyTrend.add(item);

            }


            // -------------------------------------------------
            // EMPLOYEE DATA
            // -------------------------------------------------

            List<Map<String, Object>> employeeData =
                    new ArrayList<>();


            for (
                    OrganizationMember member :
                    activeMembers
            ) {

                if (member.getUser() == null) {
                    continue;
                }


                String username =
                        member.getUser()
                                .getUsername();


                List<Activity> employeeActivities =
                        organizationActivities.stream()
                                .filter(activity ->
                                        username.equals(
                                                activity.getUsername()
                                        )
                                )
                                .toList();


                double employeeEmission =
                        calculateEmission(
                                employeeActivities
                        );


                Map<String, Object> employee =
                        new LinkedHashMap<>();


                employee.put(
                        "username",
                        username
                );

                employee.put(
                        "department",
                        member.getDepartment()
                );

                employee.put(
                        "activityCount",
                        employeeActivities.size()
                );

                employee.put(
                        "emission",
                        employeeEmission
                );


                employeeData.add(employee);

            }


            // -------------------------------------------------
            // SORT EMPLOYEES
            // -------------------------------------------------

            employeeData.sort(
                    (a, b) ->
                            Double.compare(
                                    (Double) b.get("emission"),
                                    (Double) a.get("emission")
                            )
            );


            // -------------------------------------------------
            // SUSTAINABILITY SCORE
            // -------------------------------------------------

            double sustainabilityScore =
                    calculateScore(
                            monthlyEmission,
                            activeMembers.size()
                    );


            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            Map<String, Object> response =
                    new LinkedHashMap<>();


            response.put(
                    "organizationId",
                    organizationId
            );


            response.put(
                    "employeeCount",
                    activeMembers.size()
            );


            response.put(
                    "activityCount",
                    monthActivities.size()
            );


            response.put(
                    "totalActivities",
                    organizationActivities.size()
            );


            response.put(
                    "todayEmission",
                    todayEmission
            );


            response.put(
                    "weeklyEmission",
                    weeklyEmission
            );


            response.put(
                    "monthlyEmission",
                    monthlyEmission
            );


            response.put(
                    "yearlyEmission",
                    yearlyEmission
            );


            response.put(
                    "averageEmission",
                    averageEmission
            );


            response.put(
                    "sustainabilityScore",
                    sustainabilityScore
            );


            response.put(
                    "categoryData",
                    categoryData
            );


            response.put(
                    "dailyTrend",
                    dailyTrend
            );


            response.put(
                    "weeklyTrend",
                    weeklyTrend
            );


            response.put(
                    "employees",
                    employeeData
            );


            response.put(
                    "reportingMonth",
                    currentMonth.toString()
            );


            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            Map<String, String> response =
                    new HashMap<>();


            response.put(
                    "message",
                    e.getMessage()
            );


            return ResponseEntity
                    .badRequest()
                    .body(response);

        }

    }


    // =====================================================
    // FILTER ACTIVITIES
    // =====================================================

    private List<Activity> filterActivities(
            List<Activity> activities,
            LocalDateTime start,
            LocalDateTime end
    ) {

        return activities.stream()
                .filter(activity -> {

                    if (
                            activity.getCreatedAt() == null
                    ) {

                        return false;

                    }


                    return
                            !activity.getCreatedAt()
                                    .isBefore(start)
                                    &&
                                    activity.getCreatedAt()
                                            .isBefore(end);

                })
                .toList();

    }


    // =====================================================
    // CALCULATE EMISSION
    // =====================================================

    private double calculateEmission(
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


    // =====================================================
    // NORMALIZE CATEGORY
    // =====================================================

    private String normalizeCategory(
            String category
    ) {

        if (category == null) {
            return "Other";
        }


        String value =
                category.trim()
                        .toLowerCase();


        if (
                value.contains("transport") ||
                        value.contains("travel") ||
                        value.contains("vehicle")
        ) {

            return "Transport";

        }


        if (
                value.contains("electric") ||
                        value.contains("power")
        ) {

            return "Electricity";

        }


        if (
                value.contains("food") ||
                        value.contains("meal")
        ) {

            return "Food";

        }


        if (
                value.contains("shopping") ||
                        value.contains("purchase")
        ) {

            return "Shopping";

        }


        return "Other";

    }


    // =====================================================
    // SUSTAINABILITY SCORE
    // =====================================================

    private double calculateScore(
            double monthlyEmission,
            int employeeCount
    ) {

        if (employeeCount <= 0) {
            return 100;
        }


        double emissionPerEmployee =
                monthlyEmission /
                        employeeCount;


        /*
         * Initial scoring model.
         *
         * This can later be replaced with
         * a more formal organization
         * sustainability scoring model.
         */

        double score =
                100 -
                        (emissionPerEmployee * 2);


        if (score < 0) {
            score = 0;
        }


        if (score > 100) {
            score = 100;
        }


        return score;

    }

}