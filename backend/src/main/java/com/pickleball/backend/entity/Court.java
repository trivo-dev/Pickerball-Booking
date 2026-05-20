package com.pickleball.backend.entity;

import com.pickleball.backend.enums.CourtStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    private Double pricePerHour;

    private String imageUrl;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private CourtStatus status;
}