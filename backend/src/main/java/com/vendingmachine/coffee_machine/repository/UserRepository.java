package com.vendingmachine.coffee_machine.repository;

import com.vendingmachine.coffee_machine.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}
