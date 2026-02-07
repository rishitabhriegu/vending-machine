package com.vendingmachine.coffee_machine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "receipts")
public class Receipt {
    @Id
    private String id;
    private List<ReceiptItem> items;
    private double totalAmount;
    private LocalDate createdAt;

    public Receipt(List<ReceiptItem> items, double totalAmount) {
        this.items = items;
        this.totalAmount = totalAmount;
        this.createdAt = LocalDate.from(LocalDateTime.now());
    }

    public List<ReceiptItem> getItems() {
        return items;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public double getTotalAmount() {
        return totalAmount;
    }
}
