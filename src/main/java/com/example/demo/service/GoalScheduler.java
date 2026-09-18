package com.example.demo.service;

import com.example.demo.entity.Goal;
import com.example.demo.entity.User;
import com.example.demo.repository.GoalRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class GoalScheduler {

    private final GoalRepository goalRepository;
    private final GoalService goalService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public GoalScheduler(
            GoalRepository goalRepository,
            GoalService goalService,
            EmailService emailService,
            UserRepository userRepository
    ) {
        this.goalRepository = goalRepository;
        this.goalService = goalService;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CHECK GOALS DAILY
    // =========================================================

    @Scheduled(cron = "0 0 0 * * *")
    public void checkGoals() {

        System.out.println("======================================");
        System.out.println("Checking sustainability goals...");
        System.out.println("Date: " + LocalDate.now());
        System.out.println("======================================");

        List<Goal> goals = goalRepository.findAll();

        for (Goal goal : goals) {

            try {

                // -------------------------------------------------
                // UPDATE GOAL PROGRESS
                // -------------------------------------------------

                String oldStatus = goal.getStatus();

                goalService.updateGoalProgress(goal);

                // -------------------------------------------------
                // GET UPDATED STATUS
                // -------------------------------------------------

                String newStatus = goal.getStatus();

                System.out.println(
                        "Goal: " + goal.getTitle()
                                + " | User: " + goal.getUsername()
                                + " | Status: " + newStatus
                );

                // -------------------------------------------------
                // SEND RESULT EMAIL
                // -------------------------------------------------

                if (
                        ("ACHIEVED".equals(newStatus)
                                || "NOT_ACHIEVED".equals(newStatus))
                                &&
                                !goal.isResultEmailSent()
                ) {

                    // Find user
                    User user =
                            userRepository
                                    .findByUsername(
                                            goal.getUsername()
                                    )
                                    .orElse(null);

                    // Check user exists
                    if (user == null) {

                        System.out.println(
                                "User not found: "
                                        + goal.getUsername()
                        );

                        continue;
                    }

                    // Check email exists
                    if (
                            user.getEmail() == null
                                    ||
                                    user.getEmail()
                                            .trim()
                                            .isEmpty()
                    ) {

                        System.out.println(
                                "Email not found for user: "
                                        + goal.getUsername()
                        );

                        continue;
                    }

                    // -------------------------------------------------
                    // SEND EMAIL
                    // -------------------------------------------------

                    System.out.println(
                            "Sending result email to: "
                                    + user.getEmail()
                    );

                    emailService.sendGoalResultEmail(
                            user.getEmail(),
                            goal
                    );

                    // -------------------------------------------------
                    // PREVENT DUPLICATE EMAIL
                    // -------------------------------------------------

                    goal.setResultEmailSent(true);

                    goalRepository.save(goal);

                    System.out.println(
                            "Result email sent successfully."
                    );
                }

            } catch (Exception e) {

                System.out.println(
                        "Error checking goal: "
                                + goal.getId()
                );

                e.printStackTrace();
            }
        }

        System.out.println("======================================");
        System.out.println("Goal checking completed.");
        System.out.println("======================================");
    }
}