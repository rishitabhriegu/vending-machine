package com.vendingmachine.coffee_machine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document(collection = "receipts")
public class Receipt {
    @Id
    private String id;
    private List<ReceiptItem> items;
    private double totalAmount;
    private LocalDateTime createdAt;
    private LocalDate receiptDate;
    private String username;

    public Receipt(List<ReceiptItem> items, double totalAmount) {
        this.items = items;
        this.totalAmount = totalAmount;
        this.createdAt =LocalDateTime.now();
        this.receiptDate=LocalDate.now();
    }

    public Receipt() {
        this.id = UUID.randomUUID().toString();
    }

    public List<ReceiptItem> getItems() {
        return items;
    }

    public LocalDate getReceiptDate() {
        return receiptDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setReceiptDate(LocalDate receiptDate) {
        this.receiptDate = receiptDate;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setItems(List<ReceiptItem> items) {
        this.items = items;
    }
}
