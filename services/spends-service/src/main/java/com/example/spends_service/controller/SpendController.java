package com.example.spends_service.controller;

import com.example.spends_service.model.Spend;
import com.example.spends_service.service.SpendService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SpendController {
    @Autowired
    SpendService spendService;

    @GetMapping("/spends")
    public ResponseEntity<?> getByUserName(HttpServletRequest request){
        List<Spend> spends = spendService.getAllByUsername((String) request.getAttribute("username"));
        System.out.println((String) request.getAttribute("username"));
        return ResponseEntity.ok(spends);
    }

    @PostMapping("/spends")
    public ResponseEntity<?> createSpend(@RequestBody Spend spend){
        spendService.saveSpend(spend);
        return ResponseEntity.ok("Created");
    }

    @PutMapping("/spends/{id}")
    public ResponseEntity<?> updateSpends(@PathVariable Long id, @RequestBody Spend spend, HttpServletRequest request){
        spendService.updateSpend(id, spend, (String) request.getAttribute("username"));
        return ResponseEntity.ok("Updated");
    }

    @DeleteMapping("/spends/{id}")
    public ResponseEntity<?> deleteSpend(@PathVariable Long id, HttpServletRequest request){
        spendService.deleteSpend(id,(String) request.getAttribute("username"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("spends/total")
    public ResponseEntity<?> getTotalSpends(@RequestParam String userName) {
        BigDecimal total = spendService.calculateTotalSpends(userName);
        return ResponseEntity.ok(total);
    }

    @GetMapping("spends/monthly")
    public ResponseEntity<BigDecimal> getMonthlySpends(@RequestParam String userName) {
        BigDecimal totalSum = spendService.getMonthlySpends(userName);
        return ResponseEntity.ok(totalSum !=null ? totalSum:BigDecimal.ZERO);
    }
}
