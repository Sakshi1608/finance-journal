package com.example.debt_service.controller;

import com.example.debt_service.model.CreditCard;
import com.example.debt_service.service.CreditCardService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debt")
public class CreditCardController {
    @Autowired
    CreditCardService creditCardService;

    @GetMapping("/credit")
    public ResponseEntity<?> getAllCreditDetails(HttpServletRequest request){
        String userName = (String) request.getAttribute("username");
        List<CreditCard> getAll = creditCardService.getByUserName(userName);
        return ResponseEntity.ok(getAll);
    }

    @PostMapping("/credit")
    public ResponseEntity<?> createCredit(@RequestBody CreditCard credit, HttpServletRequest request){
        creditCardService.createCredit(credit);
        return ResponseEntity.ok("Created");
    }

    @PutMapping("/credit/{id}")
    public ResponseEntity<?> updateCredit(@PathVariable Long id, @RequestBody CreditCard credit, HttpServletRequest request){
        CreditCard updated = creditCardService.updateCredit(id,credit,(String) request.getAttribute("username"));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/credit/{id}")
    public ResponseEntity<?> deleteCredit(@PathVariable Long id, HttpServletRequest request){
        creditCardService.deleteCredit(id,(String) request.getAttribute("username"));
        return ResponseEntity.ok().build();
    }


    @PutMapping("/credit/{id}/paid")
    public ResponseEntity<?> updateEmiPaidStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body, HttpServletRequest request) {
        creditCardService.updatePaidStatus(id, (String) request.getAttribute("username"),body.get("paid"));
        System.out.println(body.get("paid"));
        return ResponseEntity.ok().build();
    }
}
