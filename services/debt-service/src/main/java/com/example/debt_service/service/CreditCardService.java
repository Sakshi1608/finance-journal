package com.example.debt_service.service;

import com.example.debt_service.model.CreditCard;
import com.example.debt_service.repository.CreditCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CreditCardService {

    @Autowired
    CreditCardRepository creditCardRepository;

    public List<CreditCard> getByUserName(String userName){
        return creditCardRepository.findByUserName(userName);
    }

    public CreditCard createCredit(CreditCard credit){
        return creditCardRepository.save(credit);
    }

    public CreditCard updateCredit(Long id, CreditCard updated, String userName){
        CreditCard existing = creditCardRepository.findById(id).orElseThrow(() -> new RuntimeException("Credit Card Bill details not found!"));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized");
        }
        updated.setId(id);
        updated.setUserName(userName);
        return creditCardRepository.save(updated);
    }

    public void deleteCredit(Long id, String userName){
        CreditCard existing = creditCardRepository.findById(id).orElseThrow(() -> new RuntimeException("Credit Card Bill details not found!"));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized");
        }
        creditCardRepository.deleteById(id);
    }

    public void updatePaidStatus(Long id, String userName, boolean paid){
        CreditCard existing = creditCardRepository.findById(id).orElseThrow(()-> new RuntimeException("Not Found"));
        if(!existing.getUserName().equals(userName)){
            throw new RuntimeException("Unauthorized");
        }
        existing.setPaid(paid);
        creditCardRepository.save(existing);
    }
}
