package com.pickleball.backend.service;

import com.pickleball.backend.controller.BookingRequest;
import com.pickleball.backend.entity.Booking;
import com.pickleball.backend.entity.Court;
import com.pickleball.backend.entity.User;
import com.pickleball.backend.enums.BookingStatus;
import com.pickleball.backend.repository.BookingRepository;
import com.pickleball.backend.repository.CourtRepository;
import com.pickleball.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            CourtRepository courtRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.courtRepository = courtRepository;
        this.userRepository = userRepository;
    }

    public boolean isAvailable(Long courtId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                courtId,
                bookingDate,
                endTime.toString(),
                startTime.toString()
        );
        return conflicts.isEmpty();
    }

    public Booking createBooking(BookingRequest request) {
        Court court = courtRepository.findById(request.courtId())
                .orElseThrow(() -> new IllegalArgumentException("Court not found"));

        // Kiểm tra xem có đặt sân trùng lịch không
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                request.courtId(),
                request.bookingDate(),
                request.endTime().toString(),
                request.startTime().toString()
        );

        if (!conflictingBookings.isEmpty()) {
            throw new IllegalArgumentException("Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.");
        }

        User user = null;
        if (request.userId() != null) {
            user = userRepository.findById(request.userId()).orElse(null);
        }

        Booking booking = Booking.builder()
                .court(court)
                .user(user)
                .customerName(request.customerName())
                .phone(request.phone())
                .bookingDate(request.bookingDate())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .totalPrice(request.totalPrice())
                .status(BookingStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookings(Long userId) {
        if (userId == null) {
            return bookingRepository.findAll();
        }
        return bookingRepository.findByUserId(userId);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public Booking confirmBooking(Long id) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        if (bookingOptional.isEmpty()) {
            throw new IllegalArgumentException("Booking not found");
        }

        Booking booking = bookingOptional.get();
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }
}
