package com.example.olx.backend.email;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int OTP_EXPIRATION_MINUTES = 5;

    private static class OtpData {
        String otp;
        Instant timestamp;

        OtpData(String otp, Instant timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }
    }

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.format("%06d", secureRandom.nextInt(999999));
        otpStore.put(email, new OtpData(otp, Instant.now()));
        return otp;
    }

    public boolean verifyOtp(String email, String userOtp) {
        OtpData data = otpStore.get(email);
        if (data == null) return false;

        boolean isExpired = Duration.between(data.timestamp, Instant.now())
                .toMinutes() >= OTP_EXPIRATION_MINUTES;

        if (!data.otp.equals(userOtp) || isExpired) {
            otpStore.remove(email); // invalidate even on failed/expired attempts
            return false;
        }

        otpStore.remove(email); // invalidate after first successful use
        return true;
    }
}
