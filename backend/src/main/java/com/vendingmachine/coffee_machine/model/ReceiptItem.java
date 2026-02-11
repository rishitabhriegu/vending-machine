package com.vendingmachine.coffee_machine.model;

public class ReceiptItem {
    private String beverageName;
    private int quantity;
    private double price;

    public ReceiptItem(String beverageName, int quantity, double price) {
        this.beverageName = beverageName;
        this.quantity = quantity;
        this.price = price;
    }

    public String getBeverageName() {
        return beverageName;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }
}
