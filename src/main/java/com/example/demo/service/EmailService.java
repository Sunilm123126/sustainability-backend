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
}