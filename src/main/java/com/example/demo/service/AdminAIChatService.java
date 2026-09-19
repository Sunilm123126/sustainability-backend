package com.example.demo.service;

import com.example.demo.entity.Activity;
import com.example.demo.entity.Goal;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.GoalRepository;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminAIChatService {

    private final ActivityRepository activityRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_MODEL = "gemini-3.6-flash";

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/"
                    + GEMINI_MODEL
                    + ":generateContent";

    public AdminAIChatService(
            ActivityRepository activityRepository,
            GoalRepository goalRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper,
            RestClient restClient) {

        this.activityRepository = activityRepository;
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.restClient = restClient;
    }

    public String chat(String question) {

        if (question == null || question.trim().isEmpty()) {
            return "Please enter a question.";
        }

        try {

            // ==============================
            // FETCH ADMIN DATA
            // ==============================

            List<Activity> activities =
                    activityRepository.findAll();

            List<Goal> goals =
                    goalRepository.findAll();

            long totalUsers =
                    userRepository.count();

            // ==============================
            // DATE INFORMATION
            // ==============================

            LocalDate today = LocalDate.now();

            LocalDateTime startOfToday =
                    today.atStartOfDay();

            LocalDateTime startOfTomorrow =
                    today.plusDays(1).atStartOfDay();

            LocalDate startOfWeek =
                    today.with(
                            TemporalAdjusters.previousOrSame(
                                    DayOfWeek.MONDAY
                            )
                    );

            LocalDateTime startOfWeekDateTime =
                    startOfWeek.atStartOfDay();

            LocalDateTime startOfNextWeek =
                    startOfWeek
                            .plusWeeks(1)
                            .atStartOfDay();

            LocalDate startOfMonth =
                    today.with(
                            TemporalAdjusters.firstDayOfMonth()
                    );

            LocalDateTime startOfMonthDateTime =
                    startOfMonth.atStartOfDay();

            LocalDateTime startOfNextMonth =
                    startOfMonth
                            .plusMonths(1)
                            .atStartOfDay();

            // ==============================
            // TODAY
            // ==============================

            List<Activity> todayActivities =
                    activities.stream()
                            .filter(activity ->
                                    activity.getCreatedAt() != null
                                            &&
                                            !activity.getCreatedAt()
                                                    .isBefore(startOfToday)
                                            &&
                                            activity.getCreatedAt()
                                                    .isBefore(startOfTomorrow)
                            )
                            .toList();

            // ==============================
            // THIS WEEK
            // ==============================

            List<Activity> weekActivities =
                    activities.stream()
                            .filter(activity ->
                                    activity.getCreatedAt() != null
                                            &&
                                            !activity.getCreatedAt()
                                                    .isBefore(startOfWeekDateTime)
                                            &&
                                            activity.getCreatedAt()
                                                    .isBefore(startOfNextWeek)
                            )
                            .toList();

            // ==============================
            // THIS MONTH
            // ==============================

            List<Activity> monthActivities =
                    activities.stream()
                            .filter(activity ->
                                    activity.getCreatedAt() != null
                                            &&
                                            !activity.getCreatedAt()
                                                    .isBefore(startOfMonthDateTime)
                                            &&
                                            activity.getCreatedAt()
                                                    .isBefore(startOfNextMonth)
                            )
                            .toList();

            // ==============================
            // EMISSION CALCULATIONS
            // ==============================

            double totalEmission =
                    activities.stream()
                            .mapToDouble(this::getEmission)
                            .sum();

            double todayEmission =
                    todayActivities.stream()
                            .mapToDouble(this::getEmission)
                            .sum();

            double weekEmission =
                    weekActivities.stream()
                            .mapToDouble(this::getEmission)
                            .sum();

            double monthEmission =
                    monthActivities.stream()
                            .mapToDouble(this::getEmission)
                            .sum();

            // ==============================
            // CATEGORY-WISE EMISSIONS
            // ==============================

            Map<String, Double> categoryEmissions =
                    activities.stream()
                            .collect(
                                    Collectors.groupingBy(
                                            activity ->
                                                    activity.getCategory() == null
                                                            ? "Unknown"
                                                            : activity.getCategory(),

                                            Collectors.summingDouble(
                                                    this::getEmission
                                            )
                                    )
                            );

            // ==============================
            // USER-WISE EMISSIONS
            // ==============================

            Map<String, Double> userEmissions =
                    activities.stream()
                            .collect(
                                    Collectors.groupingBy(
                                            activity ->
                                                    activity.getUsername() == null
                                                            ? "Unknown"
                                                            : activity.getUsername(),

                                            Collectors.summingDouble(
                                                    this::getEmission
                                            )
                                    )
                            );

            // ==============================
            // CATEGORY ACTIVITY COUNTS
            // ==============================

            Map<String, Long> categoryActivityCount =
                    activities.stream()
                            .collect(
                                    Collectors.groupingBy(
                                            activity ->
                                                    activity.getCategory() == null
                                                            ? "Unknown"
                                                            : activity.getCategory(),

                                            Collectors.counting()
                                    )
                            );

            // ==============================
            // PROMPT FOR GEMINI
            // ==============================

            StringBuilder prompt =
                    new StringBuilder();

            prompt.append("""
                    You are the Admin Sustainability AI Assistant
                    for the EcoTrack sustainability analytics platform.

                    You are helping an administrator understand
                    the complete platform data.

                    IMPORTANT RULES:

                    1. Answer the administrator's actual question.
                    2. Use ONLY the data supplied below.
                    3. Do NOT invent numbers.
                    4. If the requested information is not available,
                       clearly say that it is not available.
                    5. Use kg CO2e for emissions.
                    6. Be concise but informative.
                    7. When giving statistics, mention the relevant
                       time period.
                    8. You may compare categories or users when the
                       supplied data supports the comparison.
                    9. Do not expose passwords or API keys.
                    10. Do not provide database credentials or secrets.

                    ==============================
                    ADMIN DASHBOARD DATA
                    ==============================

                    """);

            prompt.append(
                    "Total registered users: "
                            + totalUsers
                            + "\n\n"
            );

            prompt.append(
                    "Total activities recorded: "
                            + activities.size()
                            + "\n\n"
            );

            prompt.append(
                    "Total recorded emissions: "
                            + totalEmission
                            + " kg CO2e\n\n"
            );

            prompt.append(
                    "Today's activities: "
                            + todayActivities.size()
                            + "\n"
            );

            prompt.append(
                    "Today's emissions: "
                            + todayEmission
                            + " kg CO2e\n\n"
            );

            prompt.append(
                    "This week's activities: "
                            + weekActivities.size()
                            + "\n"
            );

            prompt.append(
                    "This week's emissions: "
                            + weekEmission
                            + " kg CO2e\n\n"
            );

            prompt.append(
                    "This month's activities: "
                            + monthActivities.size()
                            + "\n"
            );

            prompt.append(
                    "This month's emissions: "
                            + monthEmission
                            + " kg CO2e\n\n"
            );

            // CATEGORY DATA

            prompt.append(
                    "CATEGORY-WISE EMISSIONS:\n"
            );

            for (Map.Entry<String, Double> entry :
                    categoryEmissions.entrySet()) {

                prompt.append(
                        entry.getKey()
                                + ": "
                                + entry.getValue()
                                + " kg CO2e\n"
                );
            }

            prompt.append("\n");

            // CATEGORY ACTIVITY COUNT

            prompt.append(
                    "CATEGORY-WISE ACTIVITY COUNT:\n"
            );

            for (Map.Entry<String, Long> entry :
                    categoryActivityCount.entrySet()) {

                prompt.append(
                        entry.getKey()
                                + ": "
                                + entry.getValue()
                                + " activities\n"
                );
            }

            prompt.append("\n");

            // USER DATA

            prompt.append(
                    "USER-WISE EMISSIONS:\n"
            );

            for (Map.Entry<String, Double> entry :
                    userEmissions.entrySet()) {

                prompt.append(
                        entry.getKey()
                                + ": "
                                + entry.getValue()
                                + " kg CO2e\n"
                );
            }

            prompt.append("\n");

            // GOALS

            prompt.append(
                    "TOTAL GOALS: "
                            + goals.size()
                            + "\n\n"
            );

            // ACTIVITIES

            prompt.append(
                    "ACTIVITY RECORDS:\n"
            );

            for (Activity activity : activities) {

                prompt.append(
                        "User: "
                                + safe(activity.getUsername())
                                + " | Category: "
                                + safe(activity.getCategory())
                                + " | Activity: "
                                + safe(activity.getActivity())
                                + " | Amount: "
                                + activity.getAmount()
                                + " | Unit: "
                                + safe(activity.getUnit())
                                + " | Emission: "
                                + getEmission(activity)
                                + " kg CO2e"
                                + " | Date: "
                                + activity.getCreatedAt()
                                + "\n"
                );
            }

            prompt.append("\n");

            prompt.append(
                    "ADMIN QUESTION:\n"
            );

            prompt.append(question.trim());

            // ==============================
            // GEMINI REQUEST
            // ==============================

            Map<String, Object> requestBody =
                    Map.of(
                            "contents",
                            List.of(
                                    Map.of(
                                            "parts",
                                            List.of(
                                                    Map.of(
                                                            "text",
                                                            prompt.toString()
                                                    )
                                            )
                                    )
                            ),
                            "generationConfig",
                            Map.of(
                                    "temperature",
                                    0.4,
                                    "maxOutputTokens",
                                    800
                            )
                    );

            // ==============================
            // CALL GEMINI
            // ==============================

            String response =
                    restClient.post()
                            .uri(
                                    GEMINI_URL
                                            + "?key="
                                            + apiKey
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .body(requestBody)
                            .retrieve()
                            .body(String.class);

            // ==============================
            // EXTRACT RESPONSE
            // ==============================

            JsonNode root =
                    objectMapper.readTree(response);

            JsonNode textNode =
                    root.path("candidates")
                            .path(0)
                            .path("content")
                            .path("parts")
                            .path(0)
                            .path("text");

            if (textNode.isMissingNode()
                    || textNode.asText().isBlank()) {

                return "The AI could not generate a response.";
            }

            return textNode.asText();

        } catch (Exception e) {

            e.printStackTrace();

            return "Sorry, the Admin AI is currently unavailable.";
        }
    }

    // ==============================
    // EMISSION HELPER
    // ==============================

    private double getEmission(Activity activity) {

        if (activity.getEmission() == null) {
            return 0.0;
        }

        return activity.getEmission();
    }

    // ==============================
    // NULL-SAFE STRING
    // ==============================

    private String safe(String value) {

        return value == null
                ? "N/A"
                : value;
    }
}