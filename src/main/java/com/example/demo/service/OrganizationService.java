package com.example.demo.service;

import com.example.demo.dto.OrganizationLoginRequest;
import com.example.demo.dto.OrganizationRegistrationRequest;
import com.example.demo.entity.Organization;
import com.example.demo.repository.OrganizationRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    public OrganizationService(
            OrganizationRepository organizationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==============================
    // ORGANIZATION REGISTRATION
    // ==============================

    public Organization registerOrganization(
            OrganizationRegistrationRequest request
    ) {

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Organization name is required"
            );
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Organization email is required"
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Organization password is required"
            );
        }

        String name = request.getName().trim();

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        String password =
                request.getPassword();

        if (organizationRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "An organization with this email already exists"
            );
        }

        Organization organization =
                new Organization();

        organization.setName(name);
        organization.setEmail(email);

        // Hash password before saving
        organization.setPassword(
                passwordEncoder.encode(password)
        );

        organization.setDescription(
                request.getDescription()
        );

        organization.setIndustry(
                request.getIndustry()
        );

        return organizationRepository.save(
                organization
        );
    }


    // ==============================
    // ORGANIZATION LOGIN
    // ==============================

    public Organization loginOrganization(
            OrganizationLoginRequest request
    ) {

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Organization email is required"
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().isEmpty()) {

            throw new RuntimeException(
                    "Organization password is required"
            );
        }

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        Organization organization =
                organizationRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid organization email or password"
                                )
                        );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        organization.getPassword()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid organization email or password"
            );
        }

        return organization;
    }
}