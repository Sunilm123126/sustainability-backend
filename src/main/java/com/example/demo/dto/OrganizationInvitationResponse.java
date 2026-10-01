package com.example.demo.dto;

public class OrganizationInvitationResponse {

    private String organizationName;
    private String email;
    private String department;
    private String status;
    private String token;

    public OrganizationInvitationResponse() {
    }

    public OrganizationInvitationResponse(
            String organizationName,
            String email,
            String department,
            String status,
            String token
    ) {
        this.organizationName = organizationName;
        this.email = email;
        this.department = department;
        this.status = status;
        this.token = token;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}