package com.example.demo.dto;

public class OrganizationInvitationRequest {

    private Long organizationId;

    private String email;

    private String department;


    public OrganizationInvitationRequest() {
    }


    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
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
}
