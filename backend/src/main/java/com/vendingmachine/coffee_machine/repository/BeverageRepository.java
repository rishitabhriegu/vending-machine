package com.vendingmachine.coffee_machine.repository;

import com.vendingmachine.coffee_machine.model.Beverage;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BeverageRepository extends MongoRepository<Beverage, String> {
}
