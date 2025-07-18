package com.example.spends_service.repository;

import com.example.spends_service.model.Spend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SpendRepository extends JpaRepository<Spend, Long> {
    List<Spend> findByUserName(String userName);
    List<Spend> findAllByRecurring(String recurring);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Spend s WHERE s.userName = :userName AND s.spendDate BETWEEN :start AND :end")
    BigDecimal sumByUserNameAndDateBetween(@Param("userName") String userName,
                                           @Param("start") LocalDate start,
                                           @Param("end") LocalDate end);

}
