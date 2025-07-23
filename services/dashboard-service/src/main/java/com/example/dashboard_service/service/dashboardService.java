package com.example.dashboard_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class dashboardService {

    @Value("${services.investment}")
    private String investmentServiceUrl;

    @Value("${services.debt}")
    private String debtServiceUrl;

    @Value("${services.spends}")
    private String spendsServiceUrl;

    @Autowired
    private RestTemplate restTemplate;


    public Map<String, Object> getSummary(String authHeader, String userName) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        BigDecimal invested = restTemplate.exchange(
                investmentServiceUrl + "/api/investment/total?userName=" +userName,
                HttpMethod.GET,
                entity,
                BigDecimal.class
        ).getBody();

        BigDecimal debt = restTemplate.exchange(
                debtServiceUrl + "/api/debt/total?userName=" +userName,
                HttpMethod.GET,
                entity,
                BigDecimal.class
        ).getBody();

        BigDecimal spend = restTemplate.exchange(
                spendsServiceUrl + "/api/spends/total?userName=" +userName,
                HttpMethod.GET,
                entity,
                BigDecimal.class
        ).getBody();

        Map<String, Object> result = new HashMap<>();
        result.put("totalInvested", invested);
        result.put("totalDebt", debt);
        result.put("totalSpends", spend);

        return result;
    }


    public Map<String, Object> getMonthlySummary(String authHeader, String userName) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        BigDecimal investedMonthly = restTemplate.exchange(
                investmentServiceUrl + "/api/investment/monthly?userName=" +userName,
                HttpMethod.GET,
                entity,
                BigDecimal.class
        ).getBody();

        BigDecimal debtMonthly = restTemplate.exchange(
                debtServiceUrl + "/api/debt/monthly?userName=" +userName,
                HttpMethod.GET,
                entity,
                BigDecimal.class
        ).getBody();

        BigDecimal spendMonthly = restTemplate.exchange(
                spendsServiceUrl + "/api/spends/monthly?userName=" +userName,
                HttpMethod.GET,
                entity,
                BigDecimal.class
        ).getBody();

        Map<String, Object> result = new HashMap<>();
        result.put("investedMonthly", investedMonthly);
        result.put("debtMonthly", debtMonthly);
        result.put("spendMonthly", spendMonthly);
        System.out.println(result.get(investedMonthly));
        System.out.println(result.get(debtMonthly));
        System.out.println(result.get(spendMonthly));
        return result;
    }
}
