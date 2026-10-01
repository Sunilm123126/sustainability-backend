package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "organization_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"organization_id", "user_id"}
                )
        }
)
public class OrganizationMember {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // ORGANIZATION
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "organization_id",
            nullable = false
    )
    private Organization organization;


    // =========================================================
    // USER / EMPLOYEE
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;


    // =========================================================
    // DEPARTMENT
    // =========================================================

    private String department;


    // =========================================================
    // STATUS
    // =========================================================

    @Column(nullable = false)
    private String status;


    // =========================================================
    // JOINED DATE
    // =========================================================

    private LocalDateTime joinedAt;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OrganizationMember() {
    }


    // =========================================================
    // PRE-PERSIST
    // =========================================================

    @PrePersist
    protected void onCreate() {

        if (status == null) {
            status = "ACTIVE";
        }

        if (joinedAt == null) {
            joinedAt = LocalDateTime.now();
        }
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


    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}