package com.example.demo.controller;

import com.example.demo.entity.Goal;
import com.example.demo.service.GoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/goals", "/api/goal"})
@CrossOrigin(origins = "http://localhost:5173")
public class GoalController {

    private final GoalService goalService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }


    // =========================================================
    // TEST API
    // =========================================================

    @GetMapping
    public ResponseEntity<String> testGoalApi() {

        return ResponseEntity.ok(
                "Goal API is working successfully"
        );
    }


    // =========================================================
    // CREATE GOAL
    // =========================================================

    @PostMapping
    public ResponseEntity<Goal> createGoal(
            @RequestBody Goal goal
    ) {

        Goal createdGoal =
                goalService.createGoal(goal);

        return ResponseEntity.ok(createdGoal);
    }


    // =========================================================
    // GET ALL GOALS FOR USER
    // =========================================================

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Goal>> getGoalsByUsername(
            @PathVariable String username
    ) {

        List<Goal> goals =
                goalService.getGoalsByUsername(username);

        return ResponseEntity.ok(goals);
    }


    // =========================================================
    // GET ONE GOAL
    // =========================================================

    @GetMapping("/id/{id}")
    public ResponseEntity<Goal> getGoal(
            @PathVariable Long id
    ) {

        Goal goal =
                goalService.getGoal(id);

        return ResponseEntity.ok(goal);
    }


    // =========================================================
    // UPDATE GOAL
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(
            @PathVariable Long id,
            @RequestBody Goal goal
    ) {

        Goal updatedGoal =
                goalService.updateGoal(
                        id,
                        goal
                );

        return ResponseEntity.ok(updatedGoal);
    }


    // =========================================================
    // DELETE GOAL
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGoal(
            @PathVariable Long id
    ) {

        goalService.deleteGoal(id);

        return ResponseEntity.ok(
                "Goal deleted successfully"
        );
    }
}