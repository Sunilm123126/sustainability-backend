package com.example.demo.controller;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.LoginRequest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;


    // =========================================
    // REGISTER NEW USER
    // =========================================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password) {

        try {

            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Username is required.");
            }

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Email is required.");
            }

            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Password is required.");
            }

            String cleanUsername = username.trim();
            String cleanEmail = email.trim().toLowerCase();

            if (userRepository.findByUsername(cleanUsername).isPresent()) {
                return ResponseEntity.badRequest()
                        .body("Username already exists.");
            }

            if (userRepository.findByEmail(cleanEmail).isPresent()) {
                return ResponseEntity.badRequest()
                        .body("Email already exists.");
            }

            User user = new User();

            user.setUsername(cleanUsername);
            user.setEmail(cleanEmail);
            user.setPassword(password);
            user.setRole("USER");

            userRepository.save(user);

            return ResponseEntity.ok(
                    "Registration successful."
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Registration failed.");
        }
    }
    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        // Validate request
        if (request == null ||
                request.getUsername() == null ||
                request.getPassword() == null) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Username and password are required."
                    ));
        }


        String username =
                request.getUsername().trim();

        String password =
                request.getPassword();


        // Validate username
        if (username.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Username is required."
                    ));
        }


        // Validate password
        if (password.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Password is required."
                    ));
        }


        // =========================================
        // FIND USER
        // =========================================

        Optional<User> optionalUser =
                userRepository.findByUsername(username);


        // User does not exist
        if (optionalUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "User not found!"
                    ));
        }


        User user = optionalUser.get();


        // =========================================
        // CHECK PASSWORD
        // =========================================

        /*
         * Your current MySQL database stores passwords
         * as plain text.
         *
         * Example:
         *
         * username = s
         * password = s
         *
         * Therefore we compare directly for now.
         */

        if (!user.getPassword().equals(password)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Incorrect password!"
                    ));
        }


        // =========================================
        // SUCCESSFUL LOGIN
        // =========================================

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "username",
                user.getUsername()
        );

        response.put(
                "role",
                user.getRole() != null
                        ? user.getRole()
                        : "USER"
        );

        response.put(
                "id",
                user.getId()
        );

        response.put(
                "email",
                user.getEmail()
        );


        return ResponseEntity.ok(response);
    }


    // =========================================
    // GET ALL USERS
    // ADMIN DASHBOARD
    // =========================================

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================================
    // GET ONE USER BY USERNAME
    // =========================================

    @GetMapping("/users/{username}")
    public ResponseEntity<?> getUserByUsername(
            @PathVariable String username
    ) {

        Optional<User> user =
                userRepository.findByUsername(username);

        if (user.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User not found!"
                    ));
        }

        return ResponseEntity.ok(user.get());
    }


    // =========================================
    // DELETE USER
    // =========================================

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ) {

        if (!userRepository.existsById(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User not found!"
                    ));
        }


        userRepository.deleteById(id);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "User deleted successfully!"
                )
        );
    }
}