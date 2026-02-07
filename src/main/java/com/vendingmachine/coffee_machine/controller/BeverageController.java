package com.vendingmachine.coffee_machine.controller;

import com.vendingmachine.coffee_machine.model.Beverage;
import com.vendingmachine.coffee_machine.service.BeverageService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/beverages")
public class BeverageController {

    private final BeverageService service;

    public BeverageController(BeverageService service) {
        this.service = service;
    }

    @PostMapping
    public Beverage addBeverage(@Valid @RequestBody Beverage beverage){
        return service.addBevergae(beverage);
    }

    @GetMapping
    public List<Beverage> getAllBeveragesList(){
        return service.getAllBeverages();
    }

}
