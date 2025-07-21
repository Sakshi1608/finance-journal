package com.example.investment_service.repository;

import com.example.investment_service.model.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByUserName(String userName);
    @Query("SELECT COALESCE(SUM(i.amount),0) FROM Investment i WHERE i.userName =:userName AND i.investDate BETWEEN :start AND :end")
    BigDecimal sumByUserNameAndDateBetween(@Param("userName") String userName, @Param("start") LocalDate start, @Param("end")LocalDate end);
}
