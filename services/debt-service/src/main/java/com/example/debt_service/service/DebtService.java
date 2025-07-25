package com.example.debt_service.service;

import com.example.debt_service.model.Debt;
import com.example.debt_service.model.Emi;
import com.example.debt_service.repository.CreditCardRepository;
import com.example.debt_service.repository.DebtRepository;
import com.example.debt_service.repository.EmiRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
@Service
public class DebtService {
    @Autowired
    private DebtRepository debtRepository;
    @Autowired
    private EmiRepository emiRepository;
    @Autowired
    private CreditCardRepository creditCardRepository;

    public List<Debt> getDebtByUserName(String userName){
        return debtRepository.findByUserName(userName);
    }

    public Debt saveDebt(Debt debt){
        if(!"Yes".equalsIgnoreCase(debt.getEnableEmiTracking())){
            debt.setDueDate(debt.getDueDate());
        }
        else{
            LocalDate emiDate = debt.getEmiDate();
            int tenure = debt.getTenure();
            LocalDate finalEmiDate = emiDate.plusMonths(tenure-1);
            debt.setDueDate(finalEmiDate);
        }
        return debtRepository.save(debt);
    }
    @Transactional
    public Debt updateDebt(Long id, Debt updated, String userName){
        Debt existing = debtRepository.findById(id).orElseThrow(()->new RuntimeException("Debt Not Found"));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized");
        }
            updated.setId(id);
            updated.setUserName(userName);

        boolean wasTrackingEnabled = "Yes".equalsIgnoreCase(existing.getEnableEmiTracking());
        boolean isTrackingNowDisabled = !"Yes".equalsIgnoreCase(updated.getEnableEmiTracking());

        System.out.println("existing.getEnableEmiTracking(): " + existing.getEnableEmiTracking());
        System.out.println("updated.getEnableEmiTracking(): " + updated.getEnableEmiTracking());

        if(wasTrackingEnabled && isTrackingNowDisabled){
            System.out.println("Hello Updated No");
            emiRepository.deleteByDebtId(id);
            updated.setEmiDate(null);
            updated.setEmiAmount(null);
            updated.setDueDate(updated.getDueDate());
        }
        else if("Yes".equalsIgnoreCase(updated.getEnableEmiTracking())){
            LocalDate emiDate = updated.getEmiDate();
            int tenure = updated.getTenure();
            LocalDate finalEmiDate = emiDate.plusMonths(tenure-1);
            updated.setDueDate(finalEmiDate);
        }
            return debtRepository.save(updated);
        }

        public void deleteDebt(Long id,String userName){
            Debt existing = debtRepository.findById(id).orElseThrow(()-> new RuntimeException("Debt Not Found"));
            if(!existing.getUserName().equals(userName)){
                throw new RuntimeException("Unauthorized");
            }
            debtRepository.deleteById(id);

        }

        public void generateEmiByDebtId(Long emiAmount, LocalDate emiDate, String userName,Debt debt){
        int tenure = debt.getTenure();
        for(int i=0;i<tenure;i++){
                Emi emi = new Emi();
               LocalDate emiFinalDate = emiDate.plusMonths(i);
               emi.setDebt(debt);
               emi.setEmiDate(emiFinalDate);
               emi.setEmiAmount(emiAmount);
               emi.setPaid(false);
               emiRepository.save(emi);
        }
        }

    public List<Emi> getEmiByDebtid(Long id){
        return emiRepository.findByDebtId(id);
    }

    public void updateEmiPaidStatus(Long emiId, boolean paid) {
        Emi emi = emiRepository.findById(emiId)
                .orElseThrow(() -> new RuntimeException("EMI not found"));
        emi.setPaid(paid);
        emiRepository.save(emi);
    }
@Transactional
    public void updatePaidStatus(Long id, String userName, boolean paid){
        Debt existing = debtRepository.findById(id).orElseThrow(()-> new RuntimeException("Debt Not Found"));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized");
        }
        existing.setPaid(paid);
        emiRepository.deleteByDebtId(id);
        debtRepository.save(existing);
    }


    @Transactional
    public void updateEmisForDebt(Long debtId, LocalDate emiDate, Long emiAmount) {
        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new RuntimeException("Debt not found"));

        int tenure = debt.getTenure();

        emiRepository.deleteByDebtId(debtId);

        for(int i=0;i<tenure;i++){
            Emi emi = new Emi();
            LocalDate emiFinalDate = emiDate.plusMonths(i);
            emi.setDebt(debt);
            emi.setEmiDate(emiFinalDate);
            emi.setEmiAmount(emiAmount);
            emi.setPaid(false);
            emiRepository.save(emi);
        }
    }

    public BigDecimal getTotalDebt(String userName) {
       BigDecimal totalEmiDebt = emiRepository.sumByUserNameAndIsPaid(userName,false);
        if(totalEmiDebt == null) totalEmiDebt = BigDecimal.ZERO;
       BigDecimal totalCreditCardDebt = creditCardRepository.sumByUserNameAndPaid(userName,false);
        if (totalCreditCardDebt == null) totalCreditCardDebt = BigDecimal.ZERO;
       BigDecimal totalManualDebt = debtRepository.sumByUserNameAndEnableEmiTrackingAndPaid(userName,"No",false);
        if (totalManualDebt == null) totalManualDebt = BigDecimal.ZERO;
       BigDecimal totalDebt = totalManualDebt.add(totalCreditCardDebt.add(totalEmiDebt));
        if(totalDebt == null) totalDebt = BigDecimal.ZERO;
       return totalDebt;
    }

    public BigDecimal getMonthlyDebt(String userName){
        YearMonth currentMonth = YearMonth.now();
        LocalDate start = currentMonth.atDay(1);
        LocalDate end = currentMonth.atEndOfMonth();

        System.out.println(start+" "+end);
        BigDecimal emiThisMonth = emiRepository.sumByUserAndMonth(userName,start,end,false);
        if (emiThisMonth == null) emiThisMonth = BigDecimal.ZERO;
        BigDecimal ccBillThisMonth = creditCardRepository.sumByUserNameAndDueDateBetweenAndPaid(userName,start,end,false);
        if (ccBillThisMonth == null) ccBillThisMonth = BigDecimal.ZERO;
        BigDecimal totalSum = emiThisMonth.add(ccBillThisMonth);
        if (totalSum == null) totalSum = BigDecimal.ZERO;
        return totalSum;
    }

}
