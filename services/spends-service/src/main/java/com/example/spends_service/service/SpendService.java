package com.example.spends_service.service;

import com.example.spends_service.model.Spend;
import com.example.spends_service.repository.SpendRepository;
import com.example.spends_service.utilities.RecurrenceUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;


@Service
public class SpendService {
    @Autowired
    SpendRepository spendRepository;

    @Autowired
    private RecurrenceUtil recurrenceUtil;

    public List<Spend> getAllByUsername(String userName){
       List<Spend> allSpends =  spendRepository.findByUserName(userName);
       return allSpends;
    }

    public Spend saveSpend(Spend spend){
        if ("Yes".equalsIgnoreCase(spend.getRecurring()) && spend.getRecurringFrequency() != null) {
            LocalDate today = LocalDate.now();
            spend.setNextOccurrence(recurrenceUtil.calculateNextOccurrence(today, spend.getRecurringFrequency()));
        }
        return spendRepository.save(spend);
    }
    
    public Spend updateSpend(Long id, Spend updated, String userName){
        Spend existing = spendRepository.findById(id).orElseThrow(()-> new RuntimeException("Not Found"));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized");
        }

        if ("No".equalsIgnoreCase(updated.getRecurring())) {
            updated.setRecurringFrequency(null);
            updated.setNextOccurrence(null);
            updated.setEndDate(null);
        }

        if ("Yes".equalsIgnoreCase(updated.getRecurring()) && updated.getRecurringFrequency() != null) {
            LocalDate today = LocalDate.now();
            updated.setNextOccurrence(recurrenceUtil.calculateNextOccurrence(today, updated.getRecurringFrequency()));
        }

        updated.setId(id);
        updated.setUserName(userName);
        return spendRepository.save(updated);
    }

    @Transactional
    public void deleteSpend(Long id, String userName){
        Spend existing = spendRepository.findById(id).orElseThrow(()-> new RuntimeException("Not Found"));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized");
        }
        spendRepository.deleteById(id);
    }

    public BigDecimal calculateTotalSpends(String userName) {

        return spendRepository.findByUserName(userName)
                .stream()
                .map(spend -> BigDecimal.valueOf(spend.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getMonthlySpends(String userName){
        YearMonth currentMonth = YearMonth.now();
        LocalDate start = currentMonth.atDay(1);
        LocalDate end = currentMonth.atEndOfMonth();

        BigDecimal totalSum = spendRepository.sumByUserNameAndDateBetween(userName,start,end);
        if(totalSum == null) totalSum = BigDecimal.ZERO;
        return totalSum;
    }

}
