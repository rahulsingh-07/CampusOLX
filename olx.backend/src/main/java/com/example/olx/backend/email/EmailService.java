package com.example.olx.backend.email;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to,String otp){
        try{
            SimpleMailMessage message=new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your otp for Signup");
            message.setText(otp);
            mailSender.send(message);
        } catch (RuntimeException e) {
            log.error("Exception will sending email: {}",String.valueOf(e));
        }
    }
}
