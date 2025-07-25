package com.example.debt_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name="emi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Emi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="debt_id", nullable = false)
    @JsonIgnore
    private Debt debt;

    @Column(nullable = false)
    private LocalDate emiDate;

    @Column(nullable = false)
    private Long emiAmount;

    @Column(nullable = false)
    private boolean isPaid = false;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Debt getDebt() {
        return debt;
    }

    public void setDebt(Debt debt) {
        this.debt = debt;
    }

    public LocalDate getEmiDate() {
        return emiDate;
    }

    public void setEmiDate(LocalDate emiDate) {
        this.emiDate = emiDate;
    }

    public Long getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(Long emiAmount) {
        this.emiAmount = emiAmount;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public void setPaid(boolean paid) {
        isPaid = paid;
    }
}
