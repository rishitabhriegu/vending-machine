package com.vendingmachine.coffee_machine.model;

public class ReceiptItem {

    private String beverageName;
    private int quantity;
    private double price;
    private double subtotal;

    public ReceiptItem() {}

    public ReceiptItem(String beverageName, int quantity, double price) {
        this.beverageName = beverageName;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = quantity * price;
    }

    public String getBeverageName() { return beverageName; }
    public void setBeverageName(String beverageName) { this.beverageName = beverageName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
}
