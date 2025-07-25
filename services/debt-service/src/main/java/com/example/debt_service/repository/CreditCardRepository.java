package com.example.debt_service.repository;

import com.example.debt_service.model.CreditCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {

    List<CreditCard> findByUserName(String userName);

    @Query("SELECT SUM(c.totalAmountDue) FROM CreditCard c WHERE c.userName = :userName AND c.paid = :paid")
    BigDecimal sumByUserNameAndPaid(@Param("userName") String userName, @Param("paid") boolean paid);

    @Query("SELECT SUM(c.totalAmountDue) FROM CreditCard c WHERE c.userName = :userName AND c.dueDate BETWEEN :start AND :end AND c.paid = :paid")
    BigDecimal sumByUserNameAndDueDateBetweenAndPaid(@Param("userName") String userName, @Param("start") LocalDate start, @Param("end") LocalDate end, @Param("paid") boolean paid);

}
