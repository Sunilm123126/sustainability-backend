package com.example.demo.service;
import com.example.demo.entity.Organization;
import com.example.demo.entity.OrganizationInvitation;
import com.example.demo.entity.OrganizationMember;
import com.example.demo.entity.User;
import com.example.demo.dto.OrganizationInvitationRequest;
import com.example.demo.dto.OrganizationInvitationResponse;

import com.example.demo.repository.OrganizationInvitationRepository;
import com.example.demo.repository.OrganizationMemberRepository;
import com.example.demo.repository.OrganizationRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrganizationInvitationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationInvitationRepository invitationRepository;
    private final OrganizationMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OrganizationInvitationService(
            OrganizationRepository organizationRepository,
            OrganizationInvitationRepository invitationRepository,
            OrganizationMemberRepository memberRepository,
            UserRepository userRepository,
            EmailService emailService
    ) {

        this.organizationRepository = organizationRepository;
        this.invitationRepository = invitationRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }


    // =========================================================
    // CREATE ORGANIZATION INVITATION
    // =========================================================

    @Transactional
    public OrganizationInvitation createInvitation(
            OrganizationInvitationRequest request
    ) {

        // -----------------------------------------------------
        // Validate organization ID
        // -----------------------------------------------------

        if (request == null ||
                request.getOrganizationId() == null) {

            throw new RuntimeException(
                    "Organization ID is required."
            );
        }


        // -----------------------------------------------------
        // Validate email
        // -----------------------------------------------------

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Employee email is required."
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // -----------------------------------------------------
        // Find organization
        // -----------------------------------------------------

        Organization organization =
                organizationRepository
                        .findById(request.getOrganizationId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Organization not found."
                                )
                        );


        // -----------------------------------------------------
        // Check existing pending invitation
        // -----------------------------------------------------

        List<OrganizationInvitation> existingInvitations =
                invitationRepository.findByEmail(email);


        boolean pendingInvitationExists =
                existingInvitations.stream()
                        .anyMatch(invitation ->

                                invitation.getOrganization()
                                        .getId()
                                        .equals(
                                                organization.getId()
                                        )

                                        &&

                                        "PENDING".equals(
                                                invitation.getStatus()
                                        )
                        );


        if (pendingInvitationExists) {

            throw new RuntimeException(
                    "A pending invitation already exists for this email."
            );
        }


        // -----------------------------------------------------
        // Generate unique token
        // -----------------------------------------------------

        String token;

        do {

            token = UUID.randomUUID().toString();

        } while (
                invitationRepository.existsByToken(token)
        );


        // -----------------------------------------------------
        // Create invitation
        // -----------------------------------------------------

        OrganizationInvitation invitation =
                new OrganizationInvitation();

        invitation.setOrganization(
                organization
        );

        invitation.setEmail(
                email
        );

        invitation.setDepartment(
                request.getDepartment()
        );

        invitation.setToken(
                token
        );

        invitation.setStatus(
                "PENDING"
        );


        // -----------------------------------------------------
        // Save invitation
        // -----------------------------------------------------

        OrganizationInvitation savedInvitation =
                invitationRepository.save(invitation);


        // -----------------------------------------------------
        // Create invitation link
        // -----------------------------------------------------

        String invitationLink =
                "http://localhost:5173/organization/invitation/"
                        + token;


        // -----------------------------------------------------
        // Send invitation email
        // -----------------------------------------------------

        /*
         * Because this method is @Transactional:
         *
         * If email sending throws an exception,
         * the invitation database insert will be rolled back.
         *
         * Therefore a failed email will NOT leave behind
         * a PENDING invitation.
         */

        emailService.sendOrganizationInvitationEmail(
                email,
                organization.getName(),
                invitationLink
        );


        // -----------------------------------------------------
        // Return saved invitation
        // -----------------------------------------------------

        return savedInvitation;
    }


    // =========================================================
    // GET INVITATION DETAILS
    // =========================================================

    public OrganizationInvitationResponse getInvitation(
            String token
    ) {

        // -----------------------------------------------------
        // Validate token
        // -----------------------------------------------------

        if (token == null ||
                token.trim().isEmpty()) {

            throw new RuntimeException(
                    "Invitation token is required."
            );
        }


        // -----------------------------------------------------
        // Find invitation
        // -----------------------------------------------------

        OrganizationInvitation invitation =
                invitationRepository
                        .findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invitation not found."
                                )
                        );


        // -----------------------------------------------------
        // Check status
        // -----------------------------------------------------

        if ("ACCEPTED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has already been accepted."
            );
        }


        if ("DECLINED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has already been declined."
            );
        }


        if ("EXPIRED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has expired."
            );
        }


        // -----------------------------------------------------
        // Check expiration
        // -----------------------------------------------------

        if (invitation.getExpiresAt() != null &&
                invitation.getExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            invitation.setStatus(
                    "EXPIRED"
            );

            invitationRepository.save(
                    invitation
            );

            throw new RuntimeException(
                    "This invitation has expired."
            );
        }


        // -----------------------------------------------------
        // Return invitation details
        // -----------------------------------------------------

        return new OrganizationInvitationResponse(

                invitation.getOrganization()
                        .getName(),

                invitation.getEmail(),

                invitation.getDepartment(),

                invitation.getStatus(),

                invitation.getToken()
        );
    }


    // =========================================================
    // ACCEPT INVITATION
    // =========================================================

    @Transactional
    public OrganizationMember acceptInvitation(
            String token
    ) {

        // -----------------------------------------------------
        // Validate token
        // -----------------------------------------------------

        if (token == null ||
                token.trim().isEmpty()) {

            throw new RuntimeException(
                    "Invitation token is required."
            );
        }


        // -----------------------------------------------------
        // Find invitation
        // -----------------------------------------------------

        OrganizationInvitation invitation =
                invitationRepository
                        .findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invitation not found."
                                )
                        );


        // -----------------------------------------------------
        // Check status
        // -----------------------------------------------------

        if ("ACCEPTED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has already been accepted."
            );
        }


        if ("DECLINED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has already been declined."
            );
        }


        if ("EXPIRED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has expired."
            );
        }


        // -----------------------------------------------------
        // Check expiration
        // -----------------------------------------------------

        if (invitation.getExpiresAt() != null &&
                invitation.getExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            invitation.setStatus(
                    "EXPIRED"
            );

            invitationRepository.save(
                    invitation
            );

            throw new RuntimeException(
                    "This invitation has expired."
            );
        }


        // -----------------------------------------------------
        // Get invitation email
        // -----------------------------------------------------

        String invitationEmail =
                invitation.getEmail()
                        .trim()
                        .toLowerCase();


        // -----------------------------------------------------
        // Find existing EcoTrack user
        // -----------------------------------------------------
        User employee =
                userRepository.findByEmail(invitationEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No EcoTrack user exists with the invited email address. "
                                                + "Please create an EcoTrack account using "
                                                + invitationEmail
                                                + " first."
                                )
                        );
        // -----------------------------------------------------
        // Get organization
        // -----------------------------------------------------

        Organization organization =
                invitation.getOrganization();


        // -----------------------------------------------------
        // Check existing membership
        // -----------------------------------------------------

        OrganizationMember existingMember =
                memberRepository
                        .findByOrganization_IdAndUser_Id(
                                organization.getId(),
                                employee.getId()
                        )
                        .orElse(null);


        if (existingMember != null) {

            // -------------------------------------------------
            // Already active
            // -------------------------------------------------

            if ("ACTIVE".equals(
                    existingMember.getStatus()
            )) {

                throw new RuntimeException(
                        "This user is already an active member of the organization."
                );
            }


            // -------------------------------------------------
            // Reactivate membership
            // -------------------------------------------------

            existingMember.setStatus(
                    "ACTIVE"
            );

            existingMember.setDepartment(
                    invitation.getDepartment()
            );

            existingMember.setJoinedAt(
                    LocalDateTime.now()
            );


            OrganizationMember updatedMember =
                    memberRepository.save(
                            existingMember
                    );


            // -------------------------------------------------
            // Mark invitation accepted
            // -------------------------------------------------

            invitation.setStatus(
                    "ACCEPTED"
            );

            invitation.setAcceptedAt(
                    LocalDateTime.now()
            );

            invitationRepository.save(
                    invitation
            );


            return updatedMember;
        }


        // -----------------------------------------------------
        // Create new membership
        // -----------------------------------------------------

        OrganizationMember member =
                new OrganizationMember();

        member.setOrganization(
                organization
        );

        member.setUser(
                employee
        );

        member.setDepartment(
                invitation.getDepartment()
        );

        member.setStatus(
                "ACTIVE"
        );

        member.setJoinedAt(
                LocalDateTime.now()
        );


        // -----------------------------------------------------
        // Save membership
        // -----------------------------------------------------

        OrganizationMember savedMember =
                memberRepository.save(
                        member
                );


        // -----------------------------------------------------
        // Mark invitation accepted
        // -----------------------------------------------------

        invitation.setStatus(
                "ACCEPTED"
        );

        invitation.setAcceptedAt(
                LocalDateTime.now()
        );

        invitationRepository.save(
                invitation
        );


        // -----------------------------------------------------
        // Return membership
        // -----------------------------------------------------

        return savedMember;
    }


    // =========================================================
    // DECLINE INVITATION
    // =========================================================

    @Transactional
    public OrganizationInvitationResponse declineInvitation(
            String token
    ) {

        // -----------------------------------------------------
        // Validate token
        // -----------------------------------------------------

        if (token == null ||
                token.trim().isEmpty()) {

            throw new RuntimeException(
                    "Invitation token is required."
            );
        }


        // -----------------------------------------------------
        // Find invitation
        // -----------------------------------------------------

        OrganizationInvitation invitation =
                invitationRepository
                        .findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invitation not found."
                                )
                        );


        // -----------------------------------------------------
        // Check status
        // -----------------------------------------------------

        if ("ACCEPTED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has already been accepted."
            );
        }


        if ("DECLINED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has already been declined."
            );
        }


        if ("EXPIRED".equals(
                invitation.getStatus()
        )) {

            throw new RuntimeException(
                    "This invitation has expired."
            );
        }


        // -----------------------------------------------------
        // Check expiration
        // -----------------------------------------------------

        if (invitation.getExpiresAt() != null &&
                invitation.getExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            invitation.setStatus(
                    "EXPIRED"
            );

            invitationRepository.save(
                    invitation
            );

            throw new RuntimeException(
                    "This invitation has expired."
            );
        }


        // -----------------------------------------------------
        // Mark invitation declined
        // -----------------------------------------------------

        invitation.setStatus(
                "DECLINED"
        );


        invitationRepository.save(
                invitation
        );


        // -----------------------------------------------------
        // Return response
        // -----------------------------------------------------

        return new OrganizationInvitationResponse(

                invitation.getOrganization()
                        .getName(),

                invitation.getEmail(),

                invitation.getDepartment(),

                invitation.getStatus(),

                invitation.getToken()
        );
    }
}