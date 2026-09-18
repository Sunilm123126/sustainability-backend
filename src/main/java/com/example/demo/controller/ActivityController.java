package com.example.demo.controller;

import com.example.demo.entity.Activity;
import com.example.demo.repository.ActivityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;


    // =====================================================
    // ADD ACTIVITY
    // =====================================================

    @PostMapping("/activities")
    public ResponseEntity<?> addActivity(
            @RequestBody Activity activity) {

        try {

            // Validate username
            if (activity.getUsername() == null ||
                    activity.getUsername().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Username is required");
            }


            // Set current date/time automatically
            if (activity.getCreatedAt() == null) {

                activity.setCreatedAt(
                        LocalDateTime.now()
                );
            }


            // Validate category
            if (activity.getCategory() == null ||
                    activity.getCategory().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Category is required");
            }


            // Validate amount
            if (activity.getAmount() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Amount is required");
            }


            if (activity.getAmount() < 0) {

                return ResponseEntity
                        .badRequest()
                        .body("Amount cannot be negative");
            }


            Activity savedActivity =
                    activityRepository.save(activity);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedActivity);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Error saving activity: "
                                    + e.getMessage()
                    );
        }
    }


    // =====================================================
    // GET ACTIVITIES FOR ONE USER
    // =====================================================

    @GetMapping("/activities/{username}")
    public ResponseEntity<?> getUserActivities(
            @PathVariable String username) {

        try {

            List<Activity> activities =
                    activityRepository.findByUsername(username);

            return ResponseEntity.ok(activities);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Error loading activities: "
                                    + e.getMessage()
                    );
        }
    }


    // =====================================================
    // GET ALL ACTIVITIES
    // ADMIN
    // =====================================================

    @GetMapping("/activities")
    public ResponseEntity<?> getAllActivities() {

        try {

            return ResponseEntity.ok(
                    activityRepository.findAll()
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Error loading activities: "
                                    + e.getMessage()
                    );
        }
    }


    // =====================================================
    // DELETE ACTIVITY
    // =====================================================

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<?> deleteActivity(
            @PathVariable Long id) {

        try {

            if (!activityRepository.existsById(id)) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Activity not found");
            }

            activityRepository.deleteById(id);

            return ResponseEntity.ok(
                    "Activity deleted successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Error deleting activity: "
                                    + e.getMessage()
                    );
        }
    }
}