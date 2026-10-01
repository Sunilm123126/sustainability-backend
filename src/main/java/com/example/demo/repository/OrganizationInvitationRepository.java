package com.example.demo.repository;

import com.example.demo.entity.OrganizationInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganizationInvitationRepository
        extends JpaRepository<OrganizationInvitation, Long> {

    Optional<OrganizationInvitation> findByToken(String token);

    List<OrganizationInvitation> findByEmail(String email);

    List<OrganizationInvitation> findByOrganization_Id(Long organizationId);

    List<OrganizationInvitation> findByOrganization_IdAndStatus(
            Long organizationId,
            String status
    );

    boolean existsByToken(String token);
}