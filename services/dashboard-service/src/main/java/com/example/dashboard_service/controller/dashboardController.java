package com.example.dashboard_service.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.dashboard_service.service.dashboardService;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class dashboardController {

    @Autowired
    private dashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@RequestHeader("Authorization") String authHeader, HttpServletRequest request) {
        System.out.println(authHeader);
        Map<String, Object> summary = dashboardService.getSummary(authHeader,(String) request.getAttribute("username"));
        return ResponseEntity.ok(summary);
    }


    @GetMapping("/summary/monthly")
    public ResponseEntity<Map<String, Object>> getSummaryByMonth(@RequestHeader("Authorization") String authHeader, HttpServletRequest request) {
        Map<String, Object> monthlySummary = dashboardService.getMonthlySummary(authHeader,(String) request.getAttribute("username"));
        return ResponseEntity.ok(monthlySummary);
    }


}
