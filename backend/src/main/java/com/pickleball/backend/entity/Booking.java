package com.pickleball.backend.entity;

import com.pickleball.backend.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Double totalPrice;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String customerName;

    @Column(columnDefinition = "NVARCHAR(50)")
    private String phone;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @ManyToOne
    @JoinColumn(name = "court_id")
    private Court court;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}