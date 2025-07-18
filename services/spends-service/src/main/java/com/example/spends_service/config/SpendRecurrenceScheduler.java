package com.example.spends_service.config;

import com.example.spends_service.model.Spend;
import com.example.spends_service.repository.SpendRepository;
import com.example.spends_service.service.SpendService;
import com.example.spends_service.utilities.RecurrenceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class SpendRecurrenceScheduler {

    @Autowired
    private SpendRepository spendRepository;

    @Autowired
    private SpendService spendService;

    @Autowired
    private RecurrenceUtil recurrenceUtil;

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void generateRecurringSpends() {
        List<Spend> recurringSpends = spendRepository.findAllByRecurring("Yes");

        for (Spend sp : recurringSpends) {
            LocalDate today = LocalDate.now();

            if (sp.getNextOccurrence() != null && !today.isBefore(sp.getNextOccurrence())) {
                if (sp.getEndDate() != null && !today.isAfter(sp.getEndDate())) {
                    Spend newSpend = new Spend();
                    newSpend.setUserName(sp.getUserName());
                    newSpend.setType(sp.getType());
                    newSpend.setAmount(sp.getAmount());
                    newSpend.setSpendDate(today);
                    newSpend.setRecurring("No");
                    newSpend.setPaymentMethod(sp.getPaymentMethod());
                    newSpend.setNotes("Auto-generated recurring spend");

                    spendRepository.save(newSpend);

                    // Update next occurrence
                    LocalDate next = recurrenceUtil.calculateNextOccurrence(today, sp.getRecurringFrequency());
                    sp.setNextOccurrence(next);
                    spendRepository.save(sp);
                }

                // Optional: if endDate has passed, mark as non-recurring
                if (sp.getEndDate() != null && today.isAfter(sp.getEndDate())) {
                    sp.setRecurring("No");
                    sp.setNextOccurrence(null);
                    spendRepository.save(sp);
                }
            }
        }
    }


}