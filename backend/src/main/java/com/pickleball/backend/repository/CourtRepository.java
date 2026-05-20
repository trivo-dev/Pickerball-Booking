package com.pickleball.backend.repository;

import com.pickleball.backend.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtRepository extends JpaRepository<Court, Long> {
}