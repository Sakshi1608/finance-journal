package com.example.debt_service.repository;

import com.example.debt_service.model.Emi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Repository
public interface EmiRepository extends JpaRepository<Emi,Long> {
    List<Emi> findByDebtId(Long debt_id);
    @Modifying
    @Query("DELETE FROM Emi e WHERE e.debt.id = :debtId")
    void deleteByDebtId(@Param("debtId") Long debtId);

    @Query("SELECT SUM(e.emiAmount) FROM Emi e WHERE e.debt.userName = :userName AND e.isPaid = false")
    BigDecimal sumByUserNameAndIsPaid(@Param("userName") String userName, @Param("isPaid") boolean isPaid);

    @Query("SELECT SUM(e.emiAmount) FROM Emi e WHERE e.debt.userName = :userName AND e.emiDate BETWEEN :start AND :end AND e.isPaid = false")
    BigDecimal sumByUserAndMonth(@Param("userName") String userName, @Param("start") LocalDate start, @Param("end") LocalDate end, @Param("isPaid") boolean isPaid );
}
