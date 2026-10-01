package com.example.demo.controller;

import com.example.demo.dto.OrganizationLoginRequest;
import com.example.demo.dto.OrganizationRegistrationRequest;
import com.example.demo.entity.Organization;
import com.example.demo.service.OrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "http://localhost:5173")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(
            OrganizationService organizationService
    ) {
        this.organizationService =
                organizationService;
    }


    // ==========================================
    // ORGANIZATION REGISTRATION
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> registerOrganization(
            @RequestBody OrganizationRegistrationRequest request
    ) {

        try {

            Organization organization =
                    organizationService
                            .registerOrganization(request);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Organization registered successfully"
            );

            response.put(
                    "id",
                    organization.getId()
            );

            response.put(
                    "name",
                    organization.getName()
            );

            response.put(
                    "email",
                    organization.getEmail()
            );

            response.put(
                    "industry",
                    organization.getIndustry()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // ==========================================
    // ORGANIZATION LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> loginOrganization(
            @RequestBody OrganizationLoginRequest request
    ) {

        try {

            Organization organization =
                    organizationService
                            .loginOrganization(request);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Organization login successful"
            );

            response.put(
                    "id",
                    organization.getId()
            );

            response.put(
                    "name",
                    organization.getName()
            );

            response.put(
                    "email",
                    organization.getEmail()
            );

            response.put(
                    "industry",
                    organization.getIndustry()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }
}