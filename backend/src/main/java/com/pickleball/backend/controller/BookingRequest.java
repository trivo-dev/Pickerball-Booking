package com.pickleball.backend.controller;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingRequest(
        Long courtId,
        Long userId,
        String customerName,
        String phone,
        LocalDate bookingDate,
        LocalTime startTime,
        LocalTime endTime,
        Double totalPrice
) {
}
