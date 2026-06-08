package com.pickleball.backend.dto;

public class ResetPasswordRequest {
    private String email;
    private String pin;
    private String newPassword;

    public ResetPasswordRequest() {
    }

    public ResetPasswordRequest(String email, String pin, String newPassword) {
        this.email = email;
        this.pin = pin;
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return email;
    }

    public String getPin() {
        return pin;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}