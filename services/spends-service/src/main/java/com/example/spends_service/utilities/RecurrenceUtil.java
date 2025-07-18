package com.example.spends_service.utilities;

import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class RecurrenceUtil {
    public LocalDate calculateNextOccurrence(LocalDate from, String frequency) {
        switch (frequency.toLowerCase()) {
            case "daily":
                return from.plusDays(1);
            case "weekly":
                return from.plusWeeks(1);
            case "monthly":
                return from.plusMonths(1);
            default:
                throw new IllegalArgumentException("Unsupported frequency: " + frequency);
        }
    }
}
