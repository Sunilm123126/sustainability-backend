package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.entity.Activity;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ActivityRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public AdminController(
            UserRepository userRepository,
            ActivityRepository activityRepository) {

        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/activities")
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }
}