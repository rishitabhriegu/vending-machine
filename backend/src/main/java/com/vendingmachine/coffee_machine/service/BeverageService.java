package com.vendingmachine.coffee_machine.service;

import com.vendingmachine.coffee_machine.model.Beverage;
import com.vendingmachine.coffee_machine.repository.BeverageRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeverageService {

    private final BeverageRepository repository;

    public BeverageService(BeverageRepository repository) {
        this.repository = repository;
    }

    public List<Beverage> getAllBeverages(){
        return repository.findAll();
    }

    public Beverage addBevergae(Beverage beverage){
        return repository.save(beverage);
    }
}
