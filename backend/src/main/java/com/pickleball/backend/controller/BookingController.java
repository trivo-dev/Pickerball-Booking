package com.pickleball.backend.controller;

import com.pickleball.backend.entity.Booking;
import com.pickleball.backend.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponse> getBookings(@RequestParam(required = false) Long userId) {
        return bookingService.getBookings(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam Long courtId,
            @RequestParam String bookingDate,
            @RequestParam String startTime,
            @RequestParam String endTime
    ) {
        try {
            boolean available = bookingService.isAvailable(
                    courtId,
                    LocalDate.parse(bookingDate),
                    LocalTime.parse(startTime),
                    LocalTime.parse(endTime)
            );
            return ResponseEntity.ok(available);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getClass().getSimpleName() + ": " + ex.getMessage());
        }
    }

    @PostMapping
    public BookingResponse createBooking(@RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return toResponse(booking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }

    @PutMapping("/{id}/confirm")
    public BookingResponse confirmBooking(@PathVariable Long id) {
        Booking booking = bookingService.confirmBooking(id);
        return toResponse(booking);
    }

    private BookingResponse toResponse(Booking booking) {
        Long userId = booking.getUser() != null ? booking.getUser().getId() : null;
        return new BookingResponse(
                booking.getId(),
                booking.getCourt().getId(),
                booking.getCourt().getName(),
                booking.getCustomerName(),
                booking.getPhone(),
                booking.getBookingDate().toString(),
                booking.getStartTime().toString(),
                booking.getEndTime().toString(),
                booking.getTotalPrice(),
                booking.getStatus(),
                userId
        );
    }
}
