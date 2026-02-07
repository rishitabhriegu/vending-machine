package com.vendingmachine.coffee_machine.repository;

import com.vendingmachine.coffee_machine.model.Receipt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReceiptRepository extends MongoRepository<Receipt, String> {
    List<Receipt> findByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}   
