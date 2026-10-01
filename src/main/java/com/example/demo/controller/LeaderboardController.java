package com.example.demo.controller;

import com.example.demo.entity.Activity;
import com.example.demo.repository.ActivityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaderboardController {

    private final ActivityRepository activityRepository;

    public LeaderboardController(
            ActivityRepository activityRepository) {

        this.activityRepository = activityRepository;
    }

    @GetMapping("/leaders")
    public List<Map<String, Object>> getLeaders() {

        List<Activity> activities =
                activityRepository.findAll();

        Map<String, List<Activity>> userActivities =
                activities.stream()
                        .filter(activity ->
                                activity.getUsername() != null)
                        .collect(
                                Collectors.groupingBy(
                                        Activity::getUsername
                                )
                        );

        List<Map<String, Object>> leaders =
                new ArrayList<>();

        for (Map.Entry<String, List<Activity>> entry
                : userActivities.entrySet()) {

            String username = entry.getKey();

            List<Activity> userList =
                    entry.getValue();

            int activityCount =
                    userList.size();

            double emission =
                    userList.stream()
                            .mapToDouble(activity ->
                                    activity.getEmission() == null
                                            ? 0
                                            : activity.getEmission())
                            .sum();

            Map<String, Object> leader =
                    new HashMap<>();

            leader.put("username", username);
            leader.put("activityCount", activityCount);
            leader.put("emission", emission);

            leaders.add(leader);
        }

        leaders.sort(
                (a, b) ->
                        Integer.compare(
                                (Integer) b.get("activityCount"),
                                (Integer) a.get("activityCount")
                        )
        );

        return leaders;
    }
}