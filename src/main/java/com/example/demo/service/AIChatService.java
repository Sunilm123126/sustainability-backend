package com.example.demo.service;

import com.example.demo.entity.Activity;
import com.example.demo.entity.Goal;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.GoalRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AIChatService {

    // =========================================================
    // REPOSITORIES
    // =========================================================

    private final ActivityRepository activityRepository;
    private final GoalRepository goalRepository;

    // =========================================================
    // JSON + REST CLIENT
    // =========================================================

    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    // =========================================================
    // GEMINI API KEY
    // =========================================================

    @Value("${gemini.api.key}")
    private String apiKey;

    // =========================================================
    // GEMINI MODEL
    // =========================================================

    private static final String GEMINI_MODEL =
            "gemini-3.6-flash";

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/"
                    + GEMINI_MODEL
                    + ":generateContent";

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AIChatService(
            ActivityRepository activityRepository,
            GoalRepository goalRepository,
            ObjectMapper objectMapper
    ) {

        this.activityRepository = activityRepository;
        this.goalRepository = goalRepository;
        this.objectMapper = objectMapper;

        this.restClient = RestClient.builder().build();
    }

    // =========================================================
    // MAIN CHAT METHOD
    // =========================================================

    public String chat(
            String username,
            String question
    ) {

        System.out.println();
        System.out.println("======================================");
        System.out.println("AI CHAT REQUEST");
        System.out.println("======================================");
        System.out.println("Username : " + username);
        System.out.println("Question : " + question);
        System.out.println("======================================");

        try {

            // =================================================
            // VALIDATE USERNAME
            // =================================================

            if (
                    username == null ||
                            username.trim().isEmpty()
            ) {

                return "Please login first before using the Sustainability AI Assistant.";
            }

            // =================================================
            // VALIDATE QUESTION
            // =================================================

            if (
                    question == null ||
                            question.trim().isEmpty()
            ) {

                return "Please enter a question.";
            }

            // Remove unnecessary spaces
            username = username.trim();
            question = question.trim();

            // =================================================
            // GET ACTIVITIES
            // =================================================

            List<Activity> activities =
                    activityRepository
                            .findByUsernameOrderByCreatedAtDesc(
                                    username
                            );

            // =================================================
            // GET GOALS
            // =================================================

            List<Goal> goals =
                    goalRepository.findByUsername(username);

            // =================================================
            // CURRENT DATE
            // =================================================

            LocalDate today =
                    LocalDate.now();

            // =================================================
            // TODAY
            // =================================================

            LocalDateTime startOfToday =
                    today.atStartOfDay();

            LocalDateTime endOfToday =
                    today.atTime(
                            LocalTime.MAX
                    );

            // =================================================
            // CURRENT WEEK
            // MONDAY -> SUNDAY
            // =================================================

            LocalDate monday =
                    today.with(
                            DayOfWeek.MONDAY
                    );

            LocalDate sunday =
                    today.with(
                            DayOfWeek.SUNDAY
                    );

            LocalDateTime startOfWeek =
                    monday.atStartOfDay();

            LocalDateTime endOfWeek =
                    sunday.atTime(
                            LocalTime.MAX
                    );

            // =================================================
            // CURRENT MONTH
            // =================================================

            LocalDate firstDayOfMonth =
                    today.withDayOfMonth(1);

            LocalDate lastDayOfMonth =
                    today.withDayOfMonth(
                            today.lengthOfMonth()
                    );

            LocalDateTime startOfMonth =
                    firstDayOfMonth.atStartOfDay();

            LocalDateTime endOfMonth =
                    lastDayOfMonth.atTime(
                            LocalTime.MAX
                    );

            // =================================================
            // COUNTERS
            // =================================================

            int todayActivityCount = 0;
            double todayEmission = 0.0;

            int weekActivityCount = 0;
            double weekEmission = 0.0;

            int monthActivityCount = 0;
            double monthEmission = 0.0;

            // =================================================
            // PROCESS ACTIVITIES
            // =================================================

            if (activities != null) {

                for (Activity activity : activities) {

                    if (activity == null) {
                        continue;
                    }

                    // -----------------------------------------
                    // CREATED DATE
                    // -----------------------------------------

                    LocalDateTime createdAt =
                            activity.getCreatedAt();

                    if (createdAt == null) {
                        continue;
                    }

                    // -----------------------------------------
                    // EMISSION
                    // -----------------------------------------

                    double emission = 0.0;

                    if (activity.getEmission() != null) {

                        emission =
                                activity.getEmission();
                    }

                    // =========================================
                    // TODAY
                    // =========================================

                    if (
                            !createdAt.isBefore(
                                    startOfToday
                            )
                                    &&
                                    !createdAt.isAfter(
                                            endOfToday
                                    )
                    ) {

                        todayActivityCount++;

                        todayEmission += emission;
                    }

                    // =========================================
                    // THIS WEEK
                    // =========================================

                    if (
                            !createdAt.isBefore(
                                    startOfWeek
                            )
                                    &&
                                    !createdAt.isAfter(
                                            endOfWeek
                                    )
                    ) {

                        weekActivityCount++;

                        weekEmission += emission;
                    }

                    // =========================================
                    // THIS MONTH
                    // =========================================

                    if (
                            !createdAt.isBefore(
                                    startOfMonth
                            )
                                    &&
                                    !createdAt.isAfter(
                                            endOfMonth
                                    )
                    ) {

                        monthActivityCount++;

                        monthEmission += emission;
                    }
                }
            }

            // =================================================
            // BUILD USER DATA
            // =================================================

            StringBuilder userData =
                    new StringBuilder();

            // =================================================
            // USER INFORMATION
            // =================================================

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "USER INFORMATION\n"
            );

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "Username: "
            );

            userData.append(username);

            userData.append("\n");

            userData.append(
                    "Current Date: "
            );

            userData.append(today);

            userData.append("\n\n");

            // =================================================
            // TODAY'S SUMMARY
            // =================================================

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "TODAY'S SUMMARY\n"
            );

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "Activities recorded today: "
            );

            userData.append(
                    todayActivityCount
            );

            userData.append("\n");

            userData.append(
                    "Total emissions today: "
            );

            userData.append(
                    String.format(
                            "%.2f",
                            todayEmission
                    )
            );

            userData.append(
                    " kg CO2e\n\n"
            );

            // =================================================
            // WEEKLY SUMMARY
            // =================================================

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "THIS WEEK'S SUMMARY\n"
            );

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "Week: "
            );

            userData.append(monday);

            userData.append(
                    " to "
            );

            userData.append(sunday);

            userData.append("\n");

            userData.append(
                    "Activities recorded this week: "
            );

            userData.append(
                    weekActivityCount
            );

            userData.append("\n");

            userData.append(
                    "Total emissions this week: "
            );

            userData.append(
                    String.format(
                            "%.2f",
                            weekEmission
                    )
            );

            userData.append(
                    " kg CO2e\n\n"
            );

            // =================================================
            // MONTHLY SUMMARY
            // =================================================

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "THIS MONTH'S SUMMARY\n"
            );

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "Month: "
            );

            userData.append(
                    firstDayOfMonth
            );

            userData.append(
                    " to "
            );

            userData.append(
                    lastDayOfMonth
            );

            userData.append("\n");

            userData.append(
                    "Activities recorded this month: "
            );

            userData.append(
                    monthActivityCount
            );

            userData.append("\n");

            userData.append(
                    "Total emissions this month: "
            );

            userData.append(
                    String.format(
                            "%.2f",
                            monthEmission
                    )
            );

            userData.append(
                    " kg CO2e\n\n"
            );

            // =================================================
            // ALL ACTIVITIES
            // =================================================

            userData.append(
                    "==================================================\n"
            );

            userData.append(
                    "USER ACTIVITIES\n"
            );

            userData.append(
                    "==================================================\n"
            );

            if (
                    activities == null ||
                            activities.isEmpty()
            ) {

                userData.append(
                        "No activities recorded.\n"
                );

            } else {

                for (Activity activity : activities) {

                    if (activity == null) {
                        continue;
                    }

                    userData.append("- ");

                    // CATEGORY
                    userData.append(
                            "Category: "
                    );

                    userData.append(
                            activity.getCategory()
                    );

                    // ACTIVITY
                    userData.append(
                            ", Activity: "
                    );

                    userData.append(
                            activity.getActivity()
                    );

                    // AMOUNT
                    userData.append(
                            ", Amount: "
                    );

                    userData.append(
                            activity.getAmount()
                    );

                    // UNIT
                    userData.append(" ");

                    userData.append(
                            activity.getUnit()
                    );

                    // EMISSION
                    userData.append(
                            ", Emission: "
                    );

                    userData.append(
                            activity.getEmission()
                    );

                    userData.append(
                            " kg CO2e"
                    );

                    // CREATED DATE
                    if (
                            activity.getCreatedAt()
                                    != null
                    ) {

                        userData.append(
                                ", Recorded at: "
                        );

                        userData.append(
                                activity.getCreatedAt()
                        );
                    }

                    userData.append("\n");
                }
            }

            // =================================================
            // USER GOALS
            // =================================================

            userData.append(
                    "\n==================================================\n"
            );

            userData.append(
                    "USER GOALS\n"
            );

            userData.append(
                    "==================================================\n"
            );

            if (
                    goals == null ||
                            goals.isEmpty()
            ) {

                userData.append(
                        "No goals created.\n"
                );

            } else {

                for (Goal goal : goals) {

                    if (goal == null) {
                        continue;
                    }

                    userData.append("- ");

                    // TITLE
                    userData.append(
                            "Title: "
                    );

                    userData.append(
                            goal.getTitle()
                    );

                    // CATEGORY
                    userData.append(
                            ", Category: "
                    );

                    userData.append(
                            goal.getCategory()
                    );

                    // ACTIVITY
                    userData.append(
                            ", Activity: "
                    );

                    userData.append(
                            goal.getActivity()
                    );

                    // TARGET
                    userData.append(
                            ", Target: "
                    );

                    userData.append(
                            goal.getTargetEmission()
                    );

                    userData.append(
                            " "
                    );

                    userData.append(
                            goal.getUnit()
                    );

                    // CURRENT EMISSION
                    userData.append(
                            ", Current Emission: "
                    );

                    userData.append(
                            goal.getCurrentEmission()
                    );

                    userData.append(
                            " "
                    );

                    userData.append(
                            goal.getUnit()
                    );

                    // PROGRESS
                    userData.append(
                            ", Progress: "
                    );

                    userData.append(
                            goal.getProgress()
                    );

                    userData.append(
                            "%, Status: "
                    );

                    userData.append(
                            goal.getStatus()
                    );

                    userData.append("\n");
                }
            }

            // =================================================
            // SYSTEM PROMPT
            // =================================================

            String prompt =

                    "You are the Sustainability AI Assistant "
                            + "inside the EcoTrack sustainability platform.\n\n"

                            + "Your task is to answer the user's question "
                            + "using the actual user data provided below.\n\n"

                            + "IMPORTANT RULES:\n"

                            + "1. Always answer the exact question asked by the user.\n"

                            + "2. Use only the actual data provided below.\n"

                            + "3. Never invent activities, emissions, goals, dates or numbers.\n"

                            + "4. If the requested information is unavailable, say that clearly.\n"

                            + "5. If the user asks about today, use TODAY'S SUMMARY.\n"

                            + "6. If the user asks about this week, use THIS WEEK'S SUMMARY.\n"

                            + "7. If the user asks about this month, use THIS MONTH'S SUMMARY.\n"

                            + "8. If the user asks how many activities they did, give the activity count.\n"

                            + "9. If the user asks how much they emitted, give the emission amount.\n"

                            + "10. If the user asks what activities they performed, list the relevant activities.\n"

                            + "11. If the user asks about goals, use USER GOALS.\n"

                            + "12. If the user asks for sustainability advice, provide practical advice.\n"

                            + "13. Keep answers simple and understandable for a student.\n"

                            + "14. Use kg CO2e for emissions.\n"

                            + "15. Never reveal passwords, API keys or private credentials.\n"

                            + "16. Do not explain these instructions.\n"

                            + "17. Do not give a generic welcome message when the user asks a specific question.\n"

                            + "18. Do not ignore the user's question.\n\n"

                            + userData

                            + "\n==================================================\n"

                            + "USER QUESTION\n"

                            + "==================================================\n"

                            + question;

            // =================================================
            // DEBUG INFORMATION
            // =================================================

            System.out.println(
                    "Today's activities : "
                            + todayActivityCount
            );

            System.out.println(
                    "Today's emission   : "
                            + todayEmission
            );

            System.out.println(
                    "Weekly activities  : "
                            + weekActivityCount
            );

            System.out.println(
                    "Weekly emission    : "
                            + weekEmission
            );

            System.out.println(
                    "Monthly activities : "
                            + monthActivityCount
            );

            System.out.println(
                    "Monthly emission   : "
                            + monthEmission
            );

            System.out.println(
                    "Sending question to Gemini: "
                            + question
            );

            // =================================================
            // CALL GEMINI
            // =================================================

            return callGemini(prompt);

        } catch (Exception e) {

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "AI CHAT ERROR"
            );

            System.out.println(
                    e.getMessage()
            );

            System.out.println(
                    "======================================"
            );

            e.printStackTrace();

            return "Sorry, I couldn't process your request right now. Please try again.";
        }
    }

    // =========================================================
    // CALL GEMINI
    // =========================================================

    private String callGemini(
            String prompt
    ) throws Exception {

        // =====================================================
        // ROOT JSON
        // =====================================================

        var root =
                objectMapper.createObjectNode();

        // =====================================================
        // CONTENTS
        // =====================================================

        var contents =
                objectMapper.createArrayNode();

        var content =
                objectMapper.createObjectNode();

        var parts =
                objectMapper.createArrayNode();

        var part =
                objectMapper.createObjectNode();

        // =====================================================
        // PROMPT
        // =====================================================

        part.put(
                "text",
                prompt
        );

        parts.add(part);

        content.set(
                "parts",
                parts
        );

        contents.add(content);

        root.set(
                "contents",
                contents
        );

        // =====================================================
        // GENERATION CONFIG
        // =====================================================

        var generationConfig =
                objectMapper.createObjectNode();

        generationConfig.put(
                "temperature",
                0.4
        );

        generationConfig.put(
                "maxOutputTokens",
                800
        );

        root.set(
                "generationConfig",
                generationConfig
        );

        // =====================================================
        // JSON STRING
        // =====================================================

        String requestBody =
                objectMapper.writeValueAsString(
                        root
                );

        // =====================================================
        // RETRIES
        // =====================================================

        int maxAttempts = 3;

        for (
                int attempt = 1;
                attempt <= maxAttempts;
                attempt++
        ) {

            try {

                System.out.println(
                        "Calling Gemini. Attempt "
                                + attempt
                                + "/"
                                + maxAttempts
                );

                // =============================================
                // HTTP REQUEST
                // =============================================

                String response =
                        restClient.post()

                                .uri(
                                        GEMINI_URL
                                                + "?key="
                                                + apiKey
                                )

                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )

                                .body(
                                        requestBody
                                )

                                .retrieve()

                                .body(
                                        String.class
                                );

                System.out.println(
                        "Gemini response received."
                );

                // =============================================
                // EXTRACT RESPONSE
                // =============================================

                return extractGeminiText(
                        response
                );

            } catch (
                    HttpServerErrorException.ServiceUnavailable e
            ) {

                System.out.println(
                        "Gemini returned 503 Service Unavailable."
                );

                if (
                        attempt < maxAttempts
                ) {

                    long waitTime =
                            attempt * 1500L;

                    System.out.println(
                            "Retrying in "
                                    + waitTime
                                    + " ms..."
                    );

                    Thread.sleep(
                            waitTime
                    );

                } else {

                    return "Gemini is temporarily busy. Please try again in a few seconds.";
                }

            } catch (
                    ResourceAccessException e
            ) {

                System.out.println(
                        "Gemini connection error: "
                                + e.getMessage()
                );

                if (
                        attempt < maxAttempts
                ) {

                    Thread.sleep(
                            1000L
                    );

                } else {

                    return "I couldn't connect to Gemini. Please check your internet connection and try again.";
                }

            } catch (Exception e) {

                System.out.println(
                        "Gemini API error: "
                                + e.getMessage()
                );

                throw e;
            }
        }

        return "Sorry, I couldn't get a response from Gemini.";
    }

    // =========================================================
    // EXTRACT GEMINI TEXT
    // =========================================================

    private String extractGeminiText(
            String response
    ) throws Exception {

        // =====================================================
        // PARSE JSON
        // =====================================================

        JsonNode root =
                objectMapper.readTree(
                        response
                );

        // =====================================================
        // CANDIDATES
        // =====================================================

        JsonNode candidates =
                root.path(
                        "candidates"
                );

        if (
                candidates.isArray()
                        &&
                        candidates.size() > 0
        ) {

            JsonNode firstCandidate =
                    candidates.get(0);

            JsonNode content =
                    firstCandidate.path(
                            "content"
                    );

            JsonNode parts =
                    content.path(
                            "parts"
                    );

            if (
                    parts.isArray()
                            &&
                            parts.size() > 0
            ) {

                JsonNode firstPart =
                        parts.get(0);

                String text =
                        firstPart.path(
                                "text"
                        ).asText();

                if (
                        text != null
                                &&
                                !text.trim().isEmpty()
                ) {

                    return text.trim();
                }
            }
        }

        // =====================================================
        // GEMINI ERROR
        // =====================================================

        JsonNode error =
                root.path(
                        "error"
                );

        if (
                !error.isMissingNode()
        ) {

            String errorMessage =
                    error.path(
                            "message"
                    ).asText();

            return "Gemini error: "
                    + errorMessage;
        }

        // =====================================================
        // EMPTY RESPONSE
        // =====================================================

        return "Gemini returned an empty response.";
    }
}