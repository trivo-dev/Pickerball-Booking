package com.pickleball.backend.service;

import com.pickleball.backend.entity.Court;
import com.pickleball.backend.repository.CourtRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtService {

    private final CourtRepository courtRepository;

    public CourtService(CourtRepository courtRepository) {
        this.courtRepository = courtRepository;
    }

    public List<Court> getAllCourts() {
        return courtRepository.findAll();
    }

    public Court getCourtById(Long id) {
        return courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found"));
    }

    public Court createCourt(Court court) {
        return courtRepository.save(court);
    }

    public Court updateCourt(Long id, Court updatedCourt) {

        Court court = getCourtById(id);

        court.setName(updatedCourt.getName());
        court.setLocation(updatedCourt.getLocation());
        court.setPricePerHour(updatedCourt.getPricePerHour());
        court.setDescription(updatedCourt.getDescription());
        court.setImageUrl(updatedCourt.getImageUrl());
        court.setStatus(updatedCourt.getStatus());

        return courtRepository.save(court);
    }

    public void deleteCourt(Long id) {
        Court court = getCourtById(id);
        courtRepository.delete(court);
    }
}