package com.example.demo.repository;

import com.example.demo.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository
        extends JpaRepository<Activity, Long> {

    List<Activity> findByUsername(String username);

    List<Activity> findByUsernameOrderByCreatedAtDesc(
            String username
    );
}