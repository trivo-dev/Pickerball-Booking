package com.pickleball.backend.controller;

import com.pickleball.backend.entity.Court;
import com.pickleball.backend.service.CourtService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courts")
@CrossOrigin(origins = "http://localhost:4200")
public class CourtController {

    private final CourtService courtService;

    public CourtController(CourtService courtService) {
        this.courtService = courtService;
    }

    @GetMapping
    public List<Court> getAllCourts() {
        return courtService.getAllCourts();
    }

    @GetMapping("/{id}")
    public Court getCourtById(@PathVariable Long id) {
        return courtService.getCourtById(id);
    }

    @PostMapping
    public Court createCourt(@RequestBody Court court) {
        return courtService.createCourt(court);
    }

    @PutMapping("/{id}")
    public Court updateCourt(
            @PathVariable Long id,
            @RequestBody Court court
    ) {
        return courtService.updateCourt(id, court);
    }

    @DeleteMapping("/{id}")
    public void deleteCourt(@PathVariable Long id) {
        courtService.deleteCourt(id);
    }
}