package com.example.demo.service;
import com.example.demo.dto.GeminiRecommendationResponse;
import com.example.demo.entity.Activity;
import com.example.demo.repository.ActivityRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    private final ActivityRepository activityRepository;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public RecommendationService(
            ActivityRepository activityRepository
    ) {
        this.activityRepository = activityRepository;
        this.objectMapper = new ObjectMapper();
        this.restClient = RestClient.create();
    }

    // =====================================================
    // MAIN METHOD
    // =====================================================

    public List<GeminiRecommendationResponse> getRecommendations(
            String username
    ) {

        List<Activity> activities =
                activityRepository.findByUsernameOrderByCreatedAtDesc(
                        username
                );

        if (activities == null || activities.isEmpty()) {
            return createEmptyRecommendation();
        }

        try {

            String prompt = buildPrompt(username, activities);

            String geminiResponse = callGemini(prompt);

            return parseGeminiResponse(
                    geminiResponse,
                    activities
            );

        } catch (Exception e) {

            System.err.println(
                    "Gemini recommendation error: "
                            + e.getMessage()
            );

            e.printStackTrace();

            /*
             * Even if Gemini fails, return the REAL
             * activity information from the database.
             */
            return createFallbackRecommendations(activities);
        }
    }

    // =====================================================
    // BUILD PROMPT
    // =====================================================

    private String buildPrompt(
            String username,
            List<Activity> activities
    ) {

        StringBuilder activityData =
                new StringBuilder();

        for (int i = 0; i < activities.size(); i++) {

            Activity activity =
                    activities.get(i);

            activityData.append(
                    "Activity "
                            + (i + 1)
                            + ":\n"
            );

            activityData.append(
                    "Activity name: "
            ).append(
                    safe(activity.getActivity())
            ).append("\n");

            activityData.append(
                    "Category: "
            ).append(
                    safe(activity.getCategory())
            ).append("\n");

            activityData.append(
                    "Amount: "
            ).append(
                    activity.getAmount() == null
                            ? 0
                            : activity.getAmount()
            ).append("\n");

            activityData.append(
                    "Unit: "
            ).append(
                    safe(activity.getUnit())
            ).append("\n");

            activityData.append(
                    "CO2 emission: "
            ).append(
                    activity.getEmission() == null
                            ? 0
                            : activity.getEmission()
            ).append(
                    " kg CO2e\n\n"
            );
        }

        return """
                You are GreenPulse AI, an expert
                sustainability coach.

                USER:
                %s

                The following activity information comes
                directly from the GreenPulse database:

                %s

                IMPORTANT:

                Analyze EVERY activity.

                Generate exactly ONE personalized
                sustainability recommendation for EACH
                activity.

                The activity data is already calculated
                by GreenPulse.

                DO NOT change the activity name.

                DO NOT change the category.

                DO NOT calculate or change the amount.

                DO NOT calculate or change the emission.

                Focus ONLY on generating useful
                recommendation content.

                Higher carbon emissions should generally
                receive stronger recommendations.

                Recommendations must be:

                - personalized
                - practical
                - realistic
                - activity-specific
                - environmentally responsible
                - concise

                Examples:

                Car:
                Suggest public transport, carpooling,
                cycling or walking when practical.

                Bus:
                Encourage public transport and reducing
                unnecessary private vehicle usage.

                Electricity Usage:
                Suggest reducing unnecessary electricity
                usage, efficient appliances, LED lighting
                and renewable energy where appropriate.

                Meal:
                Suggest reducing food waste and choosing
                lower-carbon meals.

                Vegetarian Meal:
                Encourage maintaining lower-carbon food
                choices and reducing food waste.

                Non-Vegetarian Meal:
                Suggest reducing the frequency of
                high-impact meat meals and replacing some
                meals with lower-impact alternatives.

                Clothes:
                Suggest buying fewer new clothes, repairing,
                reusing, choosing durable clothing or
                second-hand clothing.

                Electronics:
                Suggest extending device lifespan,
                repairing devices and avoiding unnecessary
                upgrades.

                General Shopping:
                Suggest reducing unnecessary purchases,
                reusing products and choosing durable goods.

                Return ONLY valid JSON.

                Return exactly this structure:

                {
                  "recommendations": [
                    {
                      "title": "short attractive title",
                      "recommendation": "personalized explanation",
                      "action": "specific action the user can take",
                      "priority": "HIGH"
                    }
                  ]
                }

                The recommendations array MUST contain
                exactly one recommendation for every
                activity provided above.

                Keep the recommendations in the SAME ORDER
                as the activities.

                Priority must be exactly one of:

                HIGH
                MEDIUM
                LOW
                """
                .formatted(
                        safe(username),
                        activityData
                );
    }

    // =====================================================
    // CALL GEMINI
    // =====================================================

    private String callGemini(
            String prompt
    ) {

        String requestBody =
                """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": %s
                        }
                      ]
                    }
                  ],
                  "generationConfig": {
                    "temperature": 0.7,
                    "responseMimeType": "application/json"
                  }
                }
                """
                        .formatted(
                                toJsonString(prompt)
                        );

        return restClient
                .post()
                .uri(geminiApiUrl)
                .header(
                        "x-goog-api-key",
                        geminiApiKey
                )
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .body(requestBody)
                .retrieve()
                .body(String.class);
    }

    // =====================================================
    // PARSE GEMINI RESPONSE
    // =====================================================

    private List<GeminiRecommendationResponse>
    parseGeminiResponse(
            String geminiResponse,
            List<Activity> activities
    ) throws Exception {

        JsonNode root =
                objectMapper.readTree(
                        geminiResponse
                );

        JsonNode candidates =
                root.path("candidates");

        if (!candidates.isArray()
                || candidates.isEmpty()) {

            throw new RuntimeException(
                    "Gemini returned no candidates"
            );
        }

        JsonNode parts =
                candidates
                        .get(0)
                        .path("content")
                        .path("parts");

        if (!parts.isArray()
                || parts.isEmpty()) {

            throw new RuntimeException(
                    "Gemini returned no content"
            );
        }

        String generatedText =
                parts
                        .get(0)
                        .path("text")
                        .asText();

        if (generatedText == null
                || generatedText.isBlank()) {

            throw new RuntimeException(
                    "Gemini returned empty response"
            );
        }

        JsonNode result =
                objectMapper.readTree(
                        generatedText
                );

        JsonNode recommendations =
                result.path(
                        "recommendations"
                );

        if (!recommendations.isArray()
                || recommendations.isEmpty()) {

            throw new RuntimeException(
                    "Gemini returned empty recommendations"
            );
        }

        /*
         * IMPORTANT:
         *
         * We DO NOT take activity, amount,
         * unit or emission from Gemini.
         *
         * We take those values directly
         * from our database.
         */

        List<GeminiRecommendationResponse>
                output =
                new ArrayList<>();

        int count =
                Math.min(
                        recommendations.size(),
                        activities.size()
                );

        for (int i = 0; i < count; i++) {

            Activity originalActivity =
                    activities.get(i);

            JsonNode ai =
                    recommendations.get(i);

            String title =
                    ai.path("title")
                            .asText(
                                    "A greener choice for you"
                            );

            String recommendation =
                    ai.path("recommendation")
                            .asText(
                                    "Consider a lower-carbon alternative when practical."
                            );

            String action =
                    ai.path("action")
                            .asText(
                                    "Choose a more sustainable option next time."
                            );

            String priority =
                    ai.path("priority")
                            .asText("MEDIUM")
                            .toUpperCase();

            /*
             * Validate priority
             */

            if (!priority.equals("HIGH")
                    && !priority.equals("MEDIUM")
                    && !priority.equals("LOW")) {

                priority = "MEDIUM";
            }

            /*
             * REAL DATABASE VALUES
             */

            String activityName =
                    originalActivity.getActivity() == null
                            ? "Activity"
                            : originalActivity.getActivity();

            String category =
                    originalActivity.getCategory() == null
                            ? "Other"
                            : originalActivity.getCategory();

            double amount =
                    originalActivity.getAmount() == null
                            ? 0.0
                            : originalActivity.getAmount();

            String unit =
                    originalActivity.getUnit() == null
                            ? ""
                            : originalActivity.getUnit();

            double emission =
                    originalActivity.getEmission() == null
                            ? 0.0
                            : originalActivity.getEmission();

            /*
             * Combine:
             *
             * DATABASE
             * +
             * GEMINI
             */

            GeminiRecommendationResponse
                    recommendationResponse =
                    new GeminiRecommendationResponse(
                            activityName,
                            category,
                            amount,
                            unit,
                            emission,
                            title,
                            recommendation,
                            action,
                            priority
                    );

            output.add(
                    recommendationResponse
            );
        }

        /*
         * If Gemini did not return a recommendation
         * for every activity, use fallback for the
         * missing activities.
         */

        if (output.size() < activities.size()) {

            for (
                    int i = output.size();
                    i < activities.size();
                    i++
            ) {

                Activity activity =
                        activities.get(i);

                output.add(
                        createFallbackRecommendation(
                                activity
                        )
                );
            }
        }

        return output;
    }

    // =====================================================
    // EMPTY RECOMMENDATION
    // =====================================================

    private List<GeminiRecommendationResponse>
    createEmptyRecommendation() {

        List<GeminiRecommendationResponse>
                result =
                new ArrayList<>();

        result.add(
                new GeminiRecommendationResponse(
                        "",
                        "",
                        0,
                        "",
                        0,
                        "Start Your Green Journey 🌱",
                        "Start logging your daily activities so GreenPulse AI can understand your carbon footprint and provide personalized recommendations.",
                        "Log your first activity",
                        "LOW"
                )
        );

        return result;
    }

    // =====================================================
    // FALLBACK
    // =====================================================

    private List<GeminiRecommendationResponse>
    createFallbackRecommendations(
            List<Activity> activities
    ) {

        List<GeminiRecommendationResponse>
                result =
                new ArrayList<>();

        for (Activity activity : activities) {

            result.add(
                    createFallbackRecommendation(
                            activity
                    )
            );
        }

        return result;
    }

    // =====================================================
    // FALLBACK FOR ONE ACTIVITY
    // =====================================================

    private GeminiRecommendationResponse
    createFallbackRecommendation(
            Activity activity
    ) {

        String activityName =
                activity.getActivity() == null
                        ? "Activity"
                        : activity.getActivity();

        String category =
                activity.getCategory() == null
                        ? "Other"
                        : activity.getCategory();

        double amount =
                activity.getAmount() == null
                        ? 0
                        : activity.getAmount();

        String unit =
                activity.getUnit() == null
                        ? ""
                        : activity.getUnit();

        double emission =
                activity.getEmission() == null
                        ? 0
                        : activity.getEmission();

        String priority;

        if (emission >= 20) {

            priority = "HIGH";

        } else if (emission >= 5) {

            priority = "MEDIUM";

        } else {

            priority = "LOW";
        }

        String title =
                "Reduce your "
                        + activityName
                        + " footprint";

        String recommendation =
                getFallbackRecommendation(
                        activityName,
                        category
                );

        String action =
                getFallbackAction(
                        activityName,
                        category
                );

        return new GeminiRecommendationResponse(
                activityName,
                category,
                amount,
                unit,
                emission,
                title,
                recommendation,
                action,
                priority
        );
    }

    // =====================================================
    // FALLBACK RECOMMENDATION TEXT
    // =====================================================

    private String getFallbackRecommendation(
            String activity,
            String category
    ) {

        String lower =
                activity.toLowerCase();

        if (lower.contains("car")) {

            return "Your car travel contributes to your transport footprint. Consider replacing some trips with public transport, walking or cycling when practical.";

        }

        if (lower.contains("bus")) {

            return "Bus travel can be a lower-carbon transport option. Combine trips and use public transport regularly where convenient.";

        }

        if (lower.contains("train")) {

            return "Train travel is generally an efficient transport choice. Consider using rail instead of higher-emission alternatives when practical.";

        }

        if (lower.contains("bike")) {

            return "Cycling can help reduce transport emissions. Consider using your bike for short trips when it is safe and practical.";

        }

        if (lower.contains("motorcycle")) {

            return "Motorcycle travel contributes to your transport footprint. Consider combining trips or using public transport for suitable journeys.";

        }

        if (lower.contains("electricity")) {

            return "Your electricity consumption contributes to your carbon footprint. Reduce unnecessary usage and use energy-efficient appliances where possible.";

        }

        if (lower.contains("non-vegetarian")) {

            return "Higher-impact meat meals can contribute significantly to food emissions. Consider replacing some meals with vegetarian or lower-carbon alternatives.";

        }

        if (lower.contains("vegetarian")) {

            return "Vegetarian meals can be a lower-carbon food choice. Continue choosing plant-rich meals and avoid unnecessary food waste.";

        }

        if (lower.contains("meal")) {

            return "Reducing food waste and choosing more plant-based meals can help lower the carbon footprint of your diet.";

        }

        if (lower.contains("clothes")) {

            return "Clothing production can have a significant environmental impact. Consider buying fewer items, repairing existing clothes and choosing durable or second-hand clothing.";

        }

        if (lower.contains("electronics")) {

            return "Electronics can have a significant production footprint. Extend device lifespan, repair devices and avoid unnecessary upgrades.";

        }

        if (lower.contains("shopping")) {

            return "Consider reducing unnecessary purchases and choosing durable, reusable products to lower your environmental impact.";

        }

        return "Consider reducing this activity when practical and choose a lower-carbon alternative where possible.";
    }

    // =====================================================
    // FALLBACK ACTION
    // =====================================================

    private String getFallbackAction(
            String activity,
            String category
    ) {

        String lower =
                activity.toLowerCase();

        if (lower.contains("car")) {

            return "Replace one suitable car trip this week with public transport, walking or cycling.";

        }

        if (lower.contains("electricity")) {

            return "Switch off unused lights and appliances and reduce unnecessary electricity usage.";

        }

        if (lower.contains("non-vegetarian")) {

            return "Replace one high-impact meat meal this week with a vegetarian meal.";

        }

        if (lower.contains("clothes")) {

            return "Before buying new clothes, check whether an existing item can be reused or repaired.";

        }

        if (lower.contains("electronics")) {

            return "Keep your current device longer and consider repair before purchasing an upgrade.";

        }

        if (lower.contains("shopping")) {

            return "Before your next purchase, ask whether you really need the item and whether a reusable option is available.";

        }

        return "Choose a lower-carbon alternative for this activity the next time you can.";
    }

    // =====================================================
    // SAFE STRING
    // =====================================================

    private String safe(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", " ")
                .replace("\r", " ");
    }

    // =====================================================
    // JSON STRING
    // =====================================================

    private String toJsonString(
            String value
    ) {

        try {

            return objectMapper.writeValueAsString(
                    value
            );

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}