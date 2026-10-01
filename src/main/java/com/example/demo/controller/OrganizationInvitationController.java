package com.example.demo.controller;

import com.example.demo.dto.OrganizationInvitationRequest;
import com.example.demo.dto.OrganizationInvitationResponse;
import com.example.demo.entity.OrganizationInvitation;
import com.example.demo.entity.OrganizationMember;
import com.example.demo.service.OrganizationInvitationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/organization/invitations")
@CrossOrigin(origins = "http://localhost:5173")
public class OrganizationInvitationController {

    private final OrganizationInvitationService invitationService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OrganizationInvitationController(
            OrganizationInvitationService invitationService
    ) {

        this.invitationService =
                invitationService;
    }


    // =========================================================
    // CREATE INVITATION
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createInvitation(
            @RequestBody OrganizationInvitationRequest request
    ) {

        try {

            OrganizationInvitation invitation =
                    invitationService.createInvitation(
                            request
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Invitation sent successfully."
            );

            response.put(
                    "id",
                    invitation.getId()
            );

            response.put(
                    "email",
                    invitation.getEmail()
            );

            response.put(
                    "status",
                    invitation.getStatus()
            );

            response.put(
                    "token",
                    invitation.getToken()
            );

            response.put(
                    "expiresAt",
                    invitation.getExpiresAt()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // =========================================================
    // GET INVITATION
    // =========================================================

    @GetMapping("/{token}")
    public ResponseEntity<?> getInvitation(
            @PathVariable String token
    ) {

        try {

            OrganizationInvitationResponse response =
                    invitationService.getInvitation(
                            token
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // =========================================================
    // ACCEPT INVITATION
    // =========================================================

    @PostMapping("/{token}/accept")
    public ResponseEntity<?> acceptInvitation(
            @PathVariable String token
    ) {

        try {

            OrganizationMember member =
                    invitationService.acceptInvitation(
                            token
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Invitation accepted successfully."
            );

            response.put(
                    "memberId",
                    member.getId()
            );

            response.put(
                    "organizationId",
                    member.getOrganization()
                            .getId()
            );

            response.put(
                    "organizationName",
                    member.getOrganization()
                            .getName()
            );

            response.put(
                    "userId",
                    member.getUser()
                            .getId()
            );

            response.put(
                    "username",
                    member.getUser()
                            .getUsername()
            );

            response.put(
                    "department",
                    member.getDepartment()
            );

            response.put(
                    "status",
                    member.getStatus()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // =========================================================
    // DECLINE INVITATION
    // =========================================================

    @PostMapping("/{token}/decline")
    public ResponseEntity<?> declineInvitation(
            @PathVariable String token
    ) {

        try {

            OrganizationInvitationResponse response =
                    invitationService.declineInvitation(
                            token
                    );

            Map<String, Object> result =
                    new HashMap<>();

            result.put(
                    "message",
                    "Invitation declined."
            );

            result.put(
                    "organizationName",
                    response.getOrganizationName()
            );

            result.put(
                    "email",
                    response.getEmail()
            );

            result.put(
                    "department",
                    response.getDepartment()
            );

            result.put(
                    "status",
                    response.getStatus()
            );

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
}