package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // USERNAME
    // =========================================================

    @Column(unique = true, nullable = false)
    private String username;


    // =========================================================
    // EMAIL
    // =========================================================

    @Column(unique = true, nullable = false)
    private String email;


    // =========================================================
    // PASSWORD
    // =========================================================

    @Column(nullable = false)
    private String password;


    // =========================================================
    // ROLE
    // =========================================================

    @Column(nullable = false)
    private String role = "USER";


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public User() {
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}