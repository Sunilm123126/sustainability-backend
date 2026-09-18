package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

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
    public ResponseEntity<String> register(
            @RequestParam String username,
            @RequestParam String password
    ) {

        // Check if username already exists
        Optional<User> existingUser =
                userRepository.findByUsername(username);

        if (existingUser.isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Username already exists!");
        }


        // Create new user
        User user = new User();

        user.setUsername(username);
        user.setPassword(password);

        // Every new registered account is USER
        user.setRole("USER");


        // Save to MySQL
        userRepository.save(user);


        return ResponseEntity.ok(
                "Registration successful!"
        );
    }


    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String username,
            @RequestParam String password
    ) {

        Optional<User> optionalUser =
                userRepository.findByUsername(username);


        // User does not exist
        if (optionalUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found!");
        }


        User user = optionalUser.get();


        // Wrong password
        if (!user.getPassword().equals(password)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect password!");
        }


        // Successful login response
        Map<String, String> response =
                new HashMap<>();

        response.put("username", user.getUsername());

        response.put(
                "role",
                user.getRole() != null
                        ? user.getRole()
                        : "USER"
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
                    .body("User not found!");
        }

        return ResponseEntity.ok(user.get());
    }


    // =========================================
    // DELETE USER
    // =========================================

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id
    ) {

        if (!userRepository.existsById(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found!");
        }


        userRepository.deleteById(id);


        return ResponseEntity.ok(
                "User deleted successfully!"
        );
    }
}7