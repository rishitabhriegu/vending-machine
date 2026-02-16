package com.vendingmachine.coffee_machine.model;

import jakarta.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "beverages")
public class Beverage {
    @Id
    private String id;

    @NotBlank(message = "Beverage name is required")
    @Size(max = 50, message = "Name cannot exceed 50 characters")
    @Indexed(unique = true)
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "1.0", message = "Price must be at least 1")
    @DecimalMax(value = "500.0", message = "Price cannot exceed 500")
    private Double price;

    public Beverage() {
        this.id = UUID.randomUUID().toString();
    }

    public Beverage(String id, String name, Double price) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @Override
    public String toString() {
        return "Beverage{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", price=" + price +
                '}';
    }
}
