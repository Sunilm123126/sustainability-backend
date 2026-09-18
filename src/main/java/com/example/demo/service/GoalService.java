package com.example.demo.service;

import com.example.demo.entity.Activity;
import com.example.demo.entity.Goal;
import com.example.demo.entity.User;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.GoalRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public GoalService(
            GoalRepository goalRepository,
            ActivityRepository activityRepository,
            UserRepository userRepository,
            EmailService emailService
    ) {
        this.goalRepository = goalRepository;
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // =========================================================
    // CREATE GOAL
    // =========================================================

    public Goal createGoal(Goal goal) {

        // -----------------------------------------------------
        // USERNAME
        // -----------------------------------------------------

        if (goal.getUsername() == null ||
                goal.getUsername().trim().isEmpty()) {

            throw new RuntimeException("Username is required");
        }

        // -----------------------------------------------------
        // TITLE
        // -----------------------------------------------------

        if (goal.getTitle() == null ||
                goal.getTitle().trim().isEmpty()) {

            throw new RuntimeException("Goal title is required");
        }

        // -----------------------------------------------------
        // CATEGORY
        // -----------------------------------------------------

        if (goal.getCategory() == null ||
                goal.getCategory().trim().isEmpty()) {

            throw new RuntimeException("Category is required");
        }

        // -----------------------------------------------------
        // ACTIVITY
        // -----------------------------------------------------

        if (goal.getActivity() == null ||
                goal.getActivity().trim().isEmpty()) {

            throw new RuntimeException("Activity is required");
        }

        // -----------------------------------------------------
        // TARGET EMISSION
        // -----------------------------------------------------

        if (goal.getTargetEmission() <= 0) {

            throw new RuntimeException(
                    "Target emission must be greater than 0"
            );
        }

        // -----------------------------------------------------
        // UNIT
        // -----------------------------------------------------

        if (goal.getUnit() == null ||
                goal.getUnit().trim().isEmpty()) {

            throw new RuntimeException("Unit is required");
        }

        // -----------------------------------------------------
        // FREQUENCY
        // -----------------------------------------------------

        if (goal.getFrequency() == null ||
                goal.getFrequency().trim().isEmpty()) {

            throw new RuntimeException("Frequency is required");
        }

        // -----------------------------------------------------
        // DIFFICULTY
        // -----------------------------------------------------

        if (goal.getDifficulty() == null ||
                goal.getDifficulty().trim().isEmpty()) {

            throw new RuntimeException("Difficulty is required");
        }

        // -----------------------------------------------------
        // START DATE
        // -----------------------------------------------------

        if (goal.getStartDate() == null) {

            goal.setStartDate(LocalDate.now());
        }

        // -----------------------------------------------------
        // END DATE
        // -----------------------------------------------------

        if (goal.getEndDate() == null) {

            throw new RuntimeException("End date is required");
        }

        // -----------------------------------------------------
        // DATE VALIDATION
        // -----------------------------------------------------

        if (goal.getEndDate()
                .isBefore(goal.getStartDate())) {

            throw new RuntimeException(
                    "End date cannot be before start date"
            );
        }

        // -----------------------------------------------------
        // INITIAL VALUES
        // -----------------------------------------------------

        goal.setCurrentEmission(0.0);
        goal.setProgress(0.0);
        goal.setStatus("PENDING");
        goal.setEmailSent(false);
        goal.setResultEmailSent(false);

        // =====================================================
        // SAVE GOAL
        // =====================================================

        Goal savedGoal =
                goalRepository.save(goal);

        // =====================================================
        // SEND GOAL CREATED EMAIL
        // =====================================================

        try {

            User user =
                    userRepository
                            .findByUsername(
                                    savedGoal.getUsername()
                            )
                            .orElse(null);

            if (user != null &&
                    user.getEmail() != null &&
                    !user.getEmail().trim().isEmpty()) {

                emailService.sendGoalCreatedEmail(
                        user.getEmail(),
                        savedGoal
                );

                // Mark email as sent
                savedGoal.setEmailSent(true);

                savedGoal =
                        goalRepository.save(savedGoal);

                System.out.println(
                        "Goal created email sent successfully to: "
                                + user.getEmail()
                );

            } else {

                System.out.println(
                        "User/email not found for username: "
                                + savedGoal.getUsername()
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Goal created, but email could not be sent."
            );

            e.printStackTrace();
        }

        // =====================================================
        // RETURN SAVED GOAL
        // =====================================================

        return savedGoal;
    }

    // =========================================================
    // GET ALL GOALS FOR USER
    // =========================================================

    public List<Goal> getGoalsByUsername(
            String username
    ) {

        List<Goal> goals =
                goalRepository.findByUsername(username);

        for (Goal goal : goals) {

            updateGoalProgress(goal);
        }

        return goals;
    }

    // =========================================================
    // GET ONE GOAL
    // =========================================================

    public Goal getGoal(Long id) {

        Goal goal =
                goalRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Goal not found"
                                )
                        );

        updateGoalProgress(goal);

        return goal;
    }

    // =========================================================
    // UPDATE GOAL
    // =========================================================

    public Goal updateGoal(
            Long id,
            Goal updatedGoal
    ) {

        Goal existingGoal =
                goalRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Goal not found"
                                )
                        );

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (updatedGoal.getUsername() == null ||
                updatedGoal.getUsername().trim().isEmpty()) {

            throw new RuntimeException("Username is required");
        }

        if (updatedGoal.getTitle() == null ||
                updatedGoal.getTitle().trim().isEmpty()) {

            throw new RuntimeException("Goal title is required");
        }

        if (updatedGoal.getCategory() == null ||
                updatedGoal.getCategory().trim().isEmpty()) {

            throw new RuntimeException("Category is required");
        }

        if (updatedGoal.getActivity() == null ||
                updatedGoal.getActivity().trim().isEmpty()) {

            throw new RuntimeException("Activity is required");
        }

        if (updatedGoal.getTargetEmission() <= 0) {

            throw new RuntimeException(
                    "Target emission must be greater than 0"
            );
        }

        if (updatedGoal.getUnit() == null ||
                updatedGoal.getUnit().trim().isEmpty()) {

            throw new RuntimeException("Unit is required");
        }

        if (updatedGoal.getFrequency() == null ||
                updatedGoal.getFrequency().trim().isEmpty()) {

            throw new RuntimeException("Frequency is required");
        }

        if (updatedGoal.getDifficulty() == null ||
                updatedGoal.getDifficulty().trim().isEmpty()) {

            throw new RuntimeException("Difficulty is required");
        }

        if (updatedGoal.getStartDate() == null) {

            updatedGoal.setStartDate(
                    existingGoal.getStartDate()
            );
        }

        if (updatedGoal.getEndDate() == null) {

            throw new RuntimeException("End date is required");
        }

        if (updatedGoal.getEndDate()
                .isBefore(updatedGoal.getStartDate())) {

            throw new RuntimeException(
                    "End date cannot be before start date"
            );
        }

        // -----------------------------------------------------
        // UPDATE FIELDS
        // -----------------------------------------------------

        existingGoal.setUsername(
                updatedGoal.getUsername()
        );

        existingGoal.setTitle(
                updatedGoal.getTitle()
        );

        existingGoal.setCategory(
                updatedGoal.getCategory()
        );

        existingGoal.setActivity(
                updatedGoal.getActivity()
        );

        existingGoal.setDescription(
                updatedGoal.getDescription()
        );

        existingGoal.setTargetEmission(
                updatedGoal.getTargetEmission()
        );

        existingGoal.setUnit(
                updatedGoal.getUnit()
        );

        existingGoal.setFrequency(
                updatedGoal.getFrequency()
        );

        existingGoal.setDifficulty(
                updatedGoal.getDifficulty()
        );

        existingGoal.setStartDate(
                updatedGoal.getStartDate()
        );

        existingGoal.setEndDate(
                updatedGoal.getEndDate()
        );

        // -----------------------------------------------------
        // RECALCULATE
        // -----------------------------------------------------

        existingGoal.setCurrentEmission(0.0);
        existingGoal.setProgress(0.0);
        existingGoal.setStatus("PENDING");

        updateGoalProgress(existingGoal);

        return existingGoal;
    }

    // =========================================================
    // UPDATE GOAL PROGRESS
    // =========================================================

    public void updateGoalProgress(
            Goal goal
    ) {

        List<Activity> activities =
                activityRepository.findByUsername(
                        goal.getUsername()
                );

        double totalEmission = 0.0;

        // -----------------------------------------------------
        // CALCULATE TOTAL EMISSION
        // -----------------------------------------------------

        for (Activity activity : activities) {

            if (activity.getCreatedAt() == null) {
                continue;
            }

            LocalDate activityDate =
                    activity.getCreatedAt().toLocalDate();

            boolean afterStart =
                    !activityDate.isBefore(
                            goal.getStartDate()
                    );

            boolean beforeEnd =
                    !activityDate.isAfter(
                            goal.getEndDate()
                    );

            if (afterStart && beforeEnd) {

                if (activity.getEmission() != null) {

                    totalEmission +=
                            activity.getEmission();
                }
            }
        }

        // -----------------------------------------------------
        // CURRENT EMISSION
        // -----------------------------------------------------

        goal.setCurrentEmission(
                round(totalEmission)
        );

        // -----------------------------------------------------
        // PROGRESS
        // -----------------------------------------------------

        double progress = 0.0;

        if (goal.getTargetEmission() > 0) {

            progress =
                    (
                            goal.getTargetEmission()
                                    -
                                    goal.getCurrentEmission()
                    )
                            /
                            goal.getTargetEmission()
                            * 100.0;
        }

        if (progress < 0) {
            progress = 0;
        }

        if (progress > 100) {
            progress = 100;
        }

        goal.setProgress(
                round(progress)
        );

        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        LocalDate today =
                LocalDate.now();

        String oldStatus =
                goal.getStatus();

        if (today.isAfter(goal.getEndDate())) {

            if (goal.getCurrentEmission()
                    <= goal.getTargetEmission()) {

                goal.setStatus("ACHIEVED");

            } else {

                goal.setStatus("NOT_ACHIEVED");
            }

        } else {

            goal.setStatus("PENDING");
        }

        // =====================================================
        // RESULT EMAIL
        // =====================================================

        boolean statusChanged =
                oldStatus == null ||
                        !oldStatus.equals(goal.getStatus());

        if (today.isAfter(goal.getEndDate()) &&
                statusChanged &&
                !goal.isResultEmailSent()) {

            try {

                User user =
                        userRepository
                                .findByUsername(
                                        goal.getUsername()
                                )
                                .orElse(null);

                if (user != null &&
                        user.getEmail() != null &&
                        !user.getEmail().trim().isEmpty()) {

                    emailService.sendGoalResultEmail(
                            user.getEmail(),
                            goal
                    );

                    goal.setResultEmailSent(true);

                    System.out.println(
                            "Goal result email sent to: "
                                    + user.getEmail()
                    );
                }

            } catch (Exception e) {

                System.out.println(
                        "Could not send goal result email."
                );

                e.printStackTrace();
            }
        }

        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        goalRepository.save(goal);
    }

    // =========================================================
    // DELETE GOAL
    // =========================================================

    public void deleteGoal(
            Long id
    ) {

        if (!goalRepository.existsById(id)) {

            throw new RuntimeException(
                    "Goal not found"
            );
        }

        goalRepository.deleteById(id);
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