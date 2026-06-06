package com.pickleball.backend.repository;

import com.pickleball.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    @Query(value = "SELECT * FROM bookings b " +
            "WHERE b.court_id = :courtId " +
            "AND b.booking_date = :bookingDate " +
            "AND b.status IN ('PENDING','CONFIRMED') " +
            "AND b.start_time < CAST(:endTime AS time) " +
            "AND b.end_time > CAST(:startTime AS time)",
            nativeQuery = true)
    List<Booking> findConflictingBookings(
            @Param("courtId") Long courtId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("endTime") String endTime,
            @Param("startTime") String startTime
    );
}