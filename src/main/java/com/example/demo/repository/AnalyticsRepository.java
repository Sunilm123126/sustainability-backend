package com.example.demo.repository;

import com.example.demo.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AnalyticsRepository extends JpaRepository<Activity, Long> {

    // =========================
    // DAILY EMISSIONS
    // =========================

    @Query("""
        SELECT a.createdAt, SUM(a.emission)
        FROM Activity a
        WHERE a.username = :username
        AND a.createdAt BETWEEN :startDate AND :endDate
        GROUP BY a.createdAt
        ORDER BY a.createdAt
    """)
    List<Object[]> getDailyEmissions(
            @Param("username") String username,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );


    // =========================
    // CATEGORY EMISSIONS
    // =========================

    @Query("""
        SELECT a.category, SUM(a.emission)
        FROM Activity a
        WHERE a.username = :username
        AND a.createdAt BETWEEN :startDate AND :endDate
        GROUP BY a.category
        ORDER BY SUM(a.emission) DESC
    """)
    List<Object[]> getCategoryEmissions(
            @Param("username") String username,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );


    // =========================
    // ACTIVITY EMISSIONS
    // =========================

    @Query("""
        SELECT a.activity, SUM(a.emission)
        FROM Activity a
        WHERE a.username = :username
        AND a.createdAt BETWEEN :startDate AND :endDate
        GROUP BY a.activity
        ORDER BY SUM(a.emission) DESC
    """)
    List<Object[]> getActivityEmissions(
            @Param("username") String username,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );


    // =========================
    // TOTAL EMISSIONS
    // =========================

    @Query("""
        SELECT COALESCE(SUM(a.emission), 0)
        FROM Activity a
        WHERE a.username = :username
        AND a.createdAt BETWEEN :startDate AND :endDate
    """)
    Double getTotalEmissions(
            @Param("username") String username,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}