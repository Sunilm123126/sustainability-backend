package com.example.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "goals")
public class Goal {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // USERNAME
    // =========================================================

    @Column(nullable = false)
    private String username;


    // =========================================================
    // GOAL TITLE
    // =========================================================

    @Column(nullable = false)
    private String title;


    // =========================================================
    // CATEGORY
    // =========================================================

    @Column(nullable = false)
    private String category;


    // =========================================================
    // ACTIVITY
    // =========================================================

    @Column(nullable = false)
    private String activity;


    // =========================================================
    // DESCRIPTION
    // =========================================================

    @Column(length = 1000)
    private String description;


    // =========================================================
    // TARGET EMISSION
    // =========================================================

    @Column(nullable = false)
    private double targetEmission;


    // =========================================================
    // CURRENT EMISSION
    // =========================================================

    @Column(nullable = false)
    private double currentEmission = 0.0;


    // =========================================================
    // UNIT
    // =========================================================

    @Column(nullable = false)
    private String unit;


    // =========================================================
    // FREQUENCY
    // =========================================================

    @Column(nullable = false)
    private String frequency;


    // =========================================================
    // DIFFICULTY
    // =========================================================

    @Column(nullable = false)
    private String difficulty;


    // =========================================================
    // START DATE
    // =========================================================

    @Column(nullable = false)
    private LocalDate startDate;


    // =========================================================
    // END DATE
    // =========================================================

    @Column(nullable = false)
    private LocalDate endDate;


    // =========================================================
    // STATUS
    // =========================================================

    /*
     * Possible values:
     *
     * PENDING
     * ACHIEVED
     * NOT_ACHIEVED
     */

    @Column(nullable = false)
    private String status = "PENDING";


    // =========================================================
    // PROGRESS
    // =========================================================

    /*
     * Progress is stored as a percentage.
     *
     * Example:
     *
     * 0.0   = 0%
     * 50.0  = 50%
     * 100.0 = 100%
     */

    @Column(nullable = false)
    private double progress = 0.0;


    // =========================================================
    // GOAL CREATED EMAIL SENT
    // =========================================================

    /*
     * false = goal creation email not sent
     * true  = goal creation email sent
     */

    @Column(nullable = false)
    private boolean emailSent = false;


    // =========================================================
    // RESULT EMAIL SENT
    // =========================================================

    /*
     * false = final result email not sent
     * true  = final result email already sent
     *
     * This prevents sending the same result email repeatedly.
     */

    @Column(nullable = false)
    private boolean resultEmailSent = false;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public Goal() {
    }


    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {
        return id;
    }


    // =========================================================
    // SET ID
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // GET USERNAME
    // =========================================================

    public String getUsername() {
        return username;
    }


    // =========================================================
    // SET USERNAME
    // =========================================================

    public void setUsername(String username) {
        this.username = username;
    }


    // =========================================================
    // GET TITLE
    // =========================================================

    public String getTitle() {
        return title;
    }


    // =========================================================
    // SET TITLE
    // =========================================================

    public void setTitle(String title) {
        this.title = title;
    }


    // =========================================================
    // GET CATEGORY
    // =========================================================

    public String getCategory() {
        return category;
    }


    // =========================================================
    // SET CATEGORY
    // =========================================================

    public void setCategory(String category) {
        this.category = category;
    }


    // =========================================================
    // GET ACTIVITY
    // =========================================================

    public String getActivity() {
        return activity;
    }


    // =========================================================
    // SET ACTIVITY
    // =========================================================

    public void setActivity(String activity) {
        this.activity = activity;
    }


    // =========================================================
    // GET DESCRIPTION
    // =========================================================

    public String getDescription() {
        return description;
    }


    // =========================================================
    // SET DESCRIPTION
    // =========================================================

    public void setDescription(String description) {
        this.description = description;
    }


    // =========================================================
    // GET TARGET EMISSION
    // =========================================================

    public double getTargetEmission() {
        return targetEmission;
    }


    // =========================================================
    // SET TARGET EMISSION
    // =========================================================

    public void setTargetEmission(double targetEmission) {
        this.targetEmission = targetEmission;
    }


    // =========================================================
    // GET CURRENT EMISSION
    // =========================================================

    public double getCurrentEmission() {
        return currentEmission;
    }


    // =========================================================
    // SET CURRENT EMISSION
    // =========================================================

    public void setCurrentEmission(double currentEmission) {
        this.currentEmission = currentEmission;
    }


    // =========================================================
    // GET UNIT
    // =========================================================

    public String getUnit() {
        return unit;
    }


    // =========================================================
    // SET UNIT
    // =========================================================

    public void setUnit(String unit) {
        this.unit = unit;
    }


    // =========================================================
    // GET FREQUENCY
    // =========================================================

    public String getFrequency() {
        return frequency;
    }


    // =========================================================
    // SET FREQUENCY
    // =========================================================

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }


    // =========================================================
    // GET DIFFICULTY
    // =========================================================

    public String getDifficulty() {
        return difficulty;
    }


    // =========================================================
    // SET DIFFICULTY
    // =========================================================

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }


    // =========================================================
    // GET START DATE
    // =========================================================

    public LocalDate getStartDate() {
        return startDate;
    }


    // =========================================================
    // SET START DATE
    // =========================================================

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }


    // =========================================================
    // GET END DATE
    // =========================================================

    public LocalDate getEndDate() {
        return endDate;
    }


    // =========================================================
    // SET END DATE
    // =========================================================

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }


    // =========================================================
    // GET STATUS
    // =========================================================

    public String getStatus() {
        return status;
    }


    // =========================================================
    // SET STATUS
    // =========================================================

    public void setStatus(String status) {
        this.status = status;
    }


    // =========================================================
    // GET PROGRESS
    // =========================================================

    public double getProgress() {
        return progress;
    }


    // =========================================================
    // SET PROGRESS
    // =========================================================

    public void setProgress(double progress) {
        this.progress = progress;
    }


    // =========================================================
    // CHECK GOAL CREATED EMAIL
    // =========================================================

    public boolean isEmailSent() {
        return emailSent;
    }


    // =========================================================
    // SET GOAL CREATED EMAIL
    // =========================================================

    public void setEmailSent(boolean emailSent) {
        this.emailSent = emailSent;
    }


    // =========================================================
    // CHECK RESULT EMAIL
    // =========================================================

    public boolean isResultEmailSent() {
        return resultEmailSent;
    }


    // =========================================================
    // SET RESULT EMAIL
    // =========================================================

    public void setResultEmailSent(
            boolean resultEmailSent
    ) {

        this.resultEmailSent = resultEmailSent;
    }
}