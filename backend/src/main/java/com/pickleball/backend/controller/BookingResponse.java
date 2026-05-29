package com.pickleball.backend.controller;

import com.pickleball.backend.enums.BookingStatus;

public record BookingResponse(
        Long id,
        Long courtId,
        String courtName,
        String customerName,
        String phone,
        String bookingDate,
        String startTime,
        String endTime,
        Double totalPrice,
        BookingStatus status,
        Long userId
) {
}
