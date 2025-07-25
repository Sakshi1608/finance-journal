package com.example.debt_service.repository;

import com.example.debt_service.model.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DebtRepository extends JpaRepository<Debt,Long> {
    List<Debt> findByUserName(String userName);
    @Query("SELECT SUM(d.amount) FROM Debt d WHERE d.userName =:userName AND d.enableEmiTracking = :tracking AND d.paid = false")
    BigDecimal sumByUserNameAndEnableEmiTrackingAndPaid(@Param("userName") String userName, @Param("tracking") String tracking,@Param("paid") boolean paid);
}
