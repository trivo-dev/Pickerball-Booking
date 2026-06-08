package com.pickleball.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendResetPasswordPin(String to, String pin) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("pickleball-booking <vantruongqn7@gmail.com>");
        message.setTo(to);
        message.setSubject("Mã PIN lấy lại mật khẩu");
        message.setText("Mã PIN của bạn là: " + pin + ". Mã có hiệu lực trong 5 phút.");
        mailSender.send(message);
    }
}