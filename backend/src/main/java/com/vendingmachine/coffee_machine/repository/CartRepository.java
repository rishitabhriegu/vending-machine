package com.vendingmachine.coffee_machine.repository;

import com.vendingmachine.coffee_machine.model.cart.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUsername(String username);
}
