package com.vendingmachine.coffee_machine.repository;

import com.vendingmachine.coffee_machine.model.Beverage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BeverageRepository extends MongoRepository<Beverage, String> {
}
