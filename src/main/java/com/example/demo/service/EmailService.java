package com.example.demo.service;

import com.example.demo.entity.Goal;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    // =========================================================
    // GOAL CREATED EMAIL
    // =========================================================

    public void sendGoalCreatedEmail(
            String email,
            Goal goal
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "🌱 Sustainability Goal Created Successfully"
        );

        String text =
                "Hello " + goal.getUsername() + ",\n\n" +

                        "🎯 Your sustainability goal has been created successfully!\n\n" +

                        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                        "          GOAL DETAILS\n" +
                        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                        "Goal Title      : " + goal.getTitle() + "\n" +
                        "Category        : " + goal.getCategory() + "\n" +
                        "Activity        : " + goal.getActivity() + "\n" +

                        "Target Emission : " +
                        goal.getTargetEmission() +
                        " " + goal.getUnit() + "\n" +

                        "Frequency       : " + goal.getFrequency() + "\n" +
                        "Difficulty      : " + goal.getDifficulty() + "\n" +
                        "Start Date      : " + goal.getStartDate() + "\n" +
                        "End Date        : " + goal.getEndDate() + "\n" +
                        "Status          : PENDING\n\n" +

                        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                        "Your goal is now being tracked by the\n" +
                        "Sustainability Monitoring Platform.\n\n" +

                        "Keep reducing your carbon footprint and\n" +
                        "work towards achieving your target! 🌍\n\n" +

                        "Good luck! 💚\n\n" +

                        "Regards,\n" +
                        "Sustainability Monitoring Platform";

        message.setText(text);

        mailSender.send(message);
    }


    // =========================================================
    // GOAL RESULT EMAIL
    // =========================================================

    public void sendGoalResultEmail(
            String email,
            Goal goal
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        if ("ACHIEVED".equals(goal.getStatus())) {

            message.setSubject(
                    "🎉 Congratulations! Sustainability Goal Achieved"
            );

            String text =
                    "Hello " + goal.getUsername() + ",\n\n" +

                            "🎉 CONGRATULATIONS!\n\n" +

                            "You have successfully achieved your\n" +
                            "sustainability goal! 🌱\n\n" +

                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "          GOAL RESULT\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                            "Goal Title      : " + goal.getTitle() + "\n" +
                            "Category        : " + goal.getCategory() + "\n" +
                            "Activity        : " + goal.getActivity() + "\n" +

                            "Target Emission : " +
                            goal.getTargetEmission() +
                            " " + goal.getUnit() + "\n" +

                            "Actual Emission : " +
                            goal.getCurrentEmission() +
                            " " + goal.getUnit() + "\n" +

                            "Progress        : " +
                            goal.getProgress() +
                            "%\n" +

                            "Status          : ACHIEVED ✅\n" +

                            "Start Date      : " +
                            goal.getStartDate() + "\n" +

                            "End Date        : " +
                            goal.getEndDate() + "\n\n" +

                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                            "Excellent work! 💚\n" +
                            "You successfully stayed within your\n" +
                            "target emission.\n\n" +

                            "Keep up the great work and continue\n" +
                            "reducing your carbon footprint! 🌍\n\n" +

                            "Regards,\n" +
                            "Sustainability Monitoring Platform";

            message.setText(text);

        } else {

            message.setSubject(
                    "📊 Sustainability Goal Result"
            );

            String text =
                    "Hello " + goal.getUsername() + ",\n\n" +

                            "Your sustainability goal period has ended.\n\n" +

                            "Unfortunately, the target emission was\n" +
                            "exceeded. ❌\n\n" +

                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "          GOAL RESULT\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                            "Goal Title      : " + goal.getTitle() + "\n" +
                            "Category        : " + goal.getCategory() + "\n" +
                            "Activity        : " + goal.getActivity() + "\n" +

                            "Target Emission : " +
                            goal.getTargetEmission() +
                            " " + goal.getUnit() + "\n" +

                            "Actual Emission : " +
                            goal.getCurrentEmission() +
                            " " + goal.getUnit() + "\n" +

                            "Progress        : " +
                            goal.getProgress() +
                            "%\n" +

                            "Status          : NOT ACHIEVED ❌\n" +

                            "Start Date      : " +
                            goal.getStartDate() + "\n" +

                            "End Date        : " +
                            goal.getEndDate() + "\n\n" +

                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

                            "Don't give up! 💪\n\n" +

                            "Try setting a new sustainability goal\n" +
                            "and continue working towards reducing\n" +
                            "your carbon footprint. 🌍\n\n" +

                            "Regards,\n" +
                            "Sustainability Monitoring Platform";

            message.setText(text);
        }

        mailSender.send(message);
    }


    // =========================================================
    // ORGANIZATION INVITATION EMAIL
    // =========================================================

    public void sendOrganizationInvitationEmail(
            String email,
            String organizationName,
            String invitationLink
    ) {

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (email == null || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Employee email is required."
            );
        }

        if (organizationName == null ||
                organizationName.trim().isEmpty()) {

            throw new RuntimeException(
                    "Organization name is required."
            );
        }

        if (invitationLink == null ||
                invitationLink.trim().isEmpty()) {

            throw new RuntimeException(
                    "Invitation link is required."
            );
        }


        // -----------------------------------------------------
        // CLEAN VALUES
        // -----------------------------------------------------

        String recipient =
                email.trim();

        String organization =
                organizationName.trim();

        String link =
                invitationLink.trim();


        // -----------------------------------------------------
        // CREATE EMAIL
        // -----------------------------------------------------

        SimpleMailMessage message =
                new SimpleMailMessage();


        // IMPORTANT:
        // This MUST be the same Gmail address that you use in:
        //
        // spring.mail.username=YOUR_GMAIL_ADDRESS
        //
        // Do NOT put the App Password here.

        message.setFrom("msun.ece2024@gmail.com");

        message.setTo(recipient);

        message.setSubject(
                "EcoTrack Organization Invitation - "
                        + organization
        );


        // -----------------------------------------------------
        // EMAIL BODY
        // -----------------------------------------------------

        String text =
                "Hello,\n\n" +

                        "You have been invited to join "
                        + organization
                        + " on the EcoTrack Sustainability Platform.\n\n" +

                        "========================================\n" +
                        "        ORGANIZATION INVITATION\n" +
                        "========================================\n\n" +

                        "Organization : "
                        + organization
                        + "\n\n" +

                        "You can accept the invitation using the link below:\n\n" +
 
                        link
                        + "\n\n" +

                        "========================================\n\n" +

                        "This invitation is valid for 7 days.\n\n" +

                        "Once you accept the invitation, your existing\n" +
                        "EcoTrack account will be connected to this\n" +
                        "organization as an employee.\n\n" +

                        "If you did not expect this invitation,\n" +
                        "you can safely ignore this email.\n\n" +

                        "Regards,\n" +
                        "EcoTrack Sustainability Platform";


        message.setText(text);


        // -----------------------------------------------------
        // SEND EMAIL
        // -----------------------------------------------------

        try {

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "SENDING ORGANIZATION INVITATION"
            );

            System.out.println(
                    "From         : YOUR_GMAIL_ADDRESS"
            );

            System.out.println(
                    "Recipient    : " + recipient
            );

            System.out.println(
                    "Organization : " + organization
            );

            System.out.println(
                    "Invitation   : " + link
            );

            System.out.println(
                    "========================================"
            );


            mailSender.send(message);


            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "EMAIL SENT SUCCESSFULLY"
            );

            System.out.println(
                    "Recipient: " + recipient
            );

            System.out.println(
                    "========================================"
            );

        } catch (Exception e) {

            System.err.println(
                    "========================================"
            );

            System.err.println(
                    "EMAIL SENDING FAILED"
            );

            System.err.println(
                    "Recipient: " + recipient
            );

            System.err.println(
                    "Organization: " + organization
            );

            System.err.println(
                    "Exception type: "
                            + e.getClass().getName()
            );

            System.err.println(
                    "Error message: "
                            + e.getMessage()
            );

            if (e.getCause() != null) {

                System.err.println(
                        "Cause: "
                                + e.getCause().getMessage()
                );
            }

            System.err.println(
                    "========================================"
            );


            throw new RuntimeException(
                    "Failed to send invitation email: "
                            + e.getMessage(),
                    e
            );
        }
    }
}