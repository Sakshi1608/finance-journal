package com.example.investment_service.controller;


import com.example.investment_service.model.Investment;
import com.example.investment_service.service.InvestmentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api")
public class InvestmentController {
    @Autowired
    private InvestmentService investmentService;

    @PostMapping("/investment")
    public ResponseEntity<?> createInvestment(@RequestBody Investment investment, HttpServletRequest request ){
        String userName = (String) request.getAttribute("username");
        investment.setUserName(userName);
        investmentService.saveInvestment(investment);
        return  ResponseEntity.status(201).body("New Investment Added!");
    }

    @GetMapping("/investment/")
    public ResponseEntity<?> getInvestmentsByUsername(HttpServletRequest request){
        String userName = (String) request.getAttribute("username");
        System.out.println(userName);
        List<Investment> investments = investmentService.getInvestmentsByUsername(userName);
        return ResponseEntity.ok(investments);
    }

    @PutMapping("/investment/{id}")
    public ResponseEntity<?> updateInvestment(@PathVariable Long id, @RequestBody Investment investment, HttpServletRequest request){
        String userName = (String) request.getAttribute("username");
        Investment updated = investmentService.updateInvestment(id,investment,userName);
        return ResponseEntity.ok(updated);

    }

    @DeleteMapping("/investment/{id}")
    public ResponseEntity<?> deleteInvestment(@PathVariable Long id,HttpServletRequest request){
        String userName = (String) request.getAttribute("username");
        investmentService.deleteInvestment(id,userName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("investment/total")
    public ResponseEntity<BigDecimal> getTotalInvestment(@RequestParam String userName) {
        System.out.println("Hello Investment User"+userName);
        BigDecimal total = investmentService.calculateTotalInvestment(userName);
        return ResponseEntity.ok(total);
    }

    @GetMapping("investment/monthly")
    public ResponseEntity<BigDecimal> getMonthlyInvestment(@RequestParam String userName) {
        System.out.println("Hello Investment User"+userName);
        BigDecimal totalSum = investmentService.getMonthlyInvestment(userName);
        System.out.println("total"+totalSum);
        return ResponseEntity.ok(totalSum !=null ? totalSum:BigDecimal.ZERO);
    }

}
