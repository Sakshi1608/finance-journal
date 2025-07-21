package com.example.investment_service.service;

import com.example.investment_service.repository.InvestmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.investment_service.model.Investment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    public List<Investment> getInvestmentsByUsername(String userName) {
        return investmentRepository.findByUserName(userName);
    }

    public Investment saveInvestment(Investment investment){
        return investmentRepository.save(investment);
    }

    public Investment updateInvestment(Long id, Investment updated,String userName){
        Investment existing = investmentRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("Investment not found with the id:"+id));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized to update this investment");}
        updated.setId(id);
        updated.setUserName(userName);
        return investmentRepository.save(updated);
    }

    public void deleteInvestment(Long id,String userName){
        Investment existing = investmentRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Investment not found with the id:"+id));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized to delete this investment");}
        investmentRepository.deleteById(id);
    }
    public BigDecimal calculateTotalInvestment(String userName) {
        return investmentRepository.findByUserName(userName)
                .stream()
                .map(inv -> BigDecimal.valueOf(inv.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getMonthlyInvestment(String userName){
        YearMonth currentMonth = YearMonth.now();
        LocalDate start = currentMonth.atDay(1);
        LocalDate end = currentMonth.atEndOfMonth();

        BigDecimal totalSum = investmentRepository.sumByUserNameAndDateBetween(userName,start,end);
        if(totalSum == null) totalSum = BigDecimal.ZERO;
        return totalSum;
    }
}
