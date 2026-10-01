package com.example.demo.repository;

import com.example.demo.entity.OrganizationMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganizationMemberRepository
        extends JpaRepository<OrganizationMember, Long> {

    List<OrganizationMember> findByOrganization_Id(Long organizationId);

    List<OrganizationMember> findByUser_Id(Long userId);

    Optional<OrganizationMember> findByOrganization_IdAndUser_Id(
            Long organizationId,
            Long userId
    );

    boolean existsByOrganization_IdAndUser_Id(
            Long organizationId,
            Long userId
    );
}