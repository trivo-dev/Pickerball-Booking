package com.pickleball.backend.dto;

public class VerifyResetPinRequest {
    private String email;
    private String pin;

    public VerifyResetPinRequest() {
    }

    public VerifyResetPinRequest(String email, String pin) {
        this.email = email;
        this.pin = pin;
    }

    public String getEmail() {
        return email;
    }

    public String getPin() {
        return pin;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}