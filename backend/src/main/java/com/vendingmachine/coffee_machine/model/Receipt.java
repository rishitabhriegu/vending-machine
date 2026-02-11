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
    private LocalDateTime createdAt;
    private LocalDate receiptDate;

    public Receipt(List<ReceiptItem> items, double totalAmount) {
        this.items = items;
        this.totalAmount = totalAmount;
        this.createdAt =LocalDateTime.now();
        this.receiptDate=LocalDate.now();
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
}
