package com.example.debt_service.controller;

import com.example.debt_service.model.Debt;
import com.example.debt_service.model.Emi;
import com.example.debt_service.repository.DebtRepository;
import com.example.debt_service.repository.EmiRepository;
import com.example.debt_service.service.DebtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Controller
@RequestMapping("/api")
public class DebtController {
    @Autowired
    private DebtService debtService;

    @Autowired
    private DebtRepository debtRepository;

    @Autowired
    private EmiRepository emiRepository;

    @GetMapping("/debt/")
    public ResponseEntity<?> getDebtByUserName(HttpServletRequest request){
        String userName = (String) request.getAttribute("username");
        System.out.println(userName);
        List<Debt> debt = debtService.getDebtByUserName(userName);
        return ResponseEntity.ok(debt);
    }

    @PostMapping("/debt")
    public ResponseEntity<?> createDebt(@RequestBody Debt debt, HttpServletRequest request){
        Debt savedDebt=debtService.saveDebt(debt);
        return ResponseEntity.ok(savedDebt);

    }

    @PutMapping("/debt/{id}")
    public ResponseEntity<?> updateDebt(@PathVariable Long id,@RequestBody Debt debt, HttpServletRequest request){
        String userName = (String) request.getAttribute("username");
        Debt updated = debtService.updateDebt(id,debt,userName);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/debt/{id}")
    public ResponseEntity<?> deleteDebt(@PathVariable Long id,HttpServletRequest request){
        String userName = (String) request.getAttribute("username");
        debtService.deleteDebt(id,userName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/debt/{id}/emis")
    public ResponseEntity<?> generateEmiSchedule(@PathVariable Long id,@RequestBody Map<String,Object> emiData, HttpServletRequest request){
        Debt debt = debtRepository.findById(id).orElseThrow(() -> new RuntimeException("Debt Not Found"));
        Long emiAmount = Long.parseLong(emiData.get("emiAmount").toString());
        LocalDate emiDate = LocalDate.parse(emiData.get("emiDate").toString());
        String userName = (String) request.getAttribute("username");
        debtService.generateEmiByDebtId(emiAmount,emiDate,userName,debt);
        return ResponseEntity.ok("Created Emi Schedule");
    }

    @GetMapping("/debt/{id}/emis")
    public ResponseEntity<?> getEmiByDebtId(@PathVariable Long id, HttpServletRequest request){
        List<Emi> emiListById =  debtService.getEmiByDebtid(id);
        System.out.println(emiListById.get(0).getEmiDate());
        return ResponseEntity.ok(emiListById);

    }

    @PutMapping("/debt/{id}/emis")
    public ResponseEntity<?> updateEmiForDebt(@PathVariable Long id, @RequestBody Map<String,Object> emiData) {
        Long emiAmount = Long.parseLong(emiData.get("emiAmount").toString());
        LocalDate emiDate = LocalDate.parse(emiData.get("emiDate").toString());
        debtService.updateEmisForDebt(id, emiDate, emiAmount);
        return ResponseEntity.ok("EMIs updated successfully");
    }

    @PutMapping("/debt/emi/{id}/paid")
    public ResponseEntity<?> updateEmiPaidStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        debtService.updateEmiPaidStatus(id, body.get("paid"));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/debt/{id}/mark-paid")
    public ResponseEntity<?> updateEmiPaidStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body, HttpServletRequest request) {
        debtService.updatePaidStatus(id, (String) request.getAttribute("username"),true);
        return ResponseEntity.ok().build();
    }

    @GetMapping("debt/total")
    public ResponseEntity<?> getTotalDebt(@RequestParam String userName) {
        BigDecimal total = debtService.getTotalDebt(userName);
        return ResponseEntity.ok(total);
    }

    @GetMapping("debt/monthly")
    public ResponseEntity<BigDecimal> getMonthlyDebt(@RequestParam String userName) {
        BigDecimal totalSum = debtService.getMonthlyDebt(userName);
        return ResponseEntity.ok(totalSum !=null ? totalSum:BigDecimal.ZERO);
    }
}
