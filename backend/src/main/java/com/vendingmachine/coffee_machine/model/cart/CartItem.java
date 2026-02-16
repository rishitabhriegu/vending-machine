package com.vendingmachine.coffee_machine.model.cart;

import com.vendingmachine.coffee_machine.model.Beverage;

public class CartItem {

    private String beverageId;
    private String beverageName;
    private double price;
    private int quantity;

    public CartItem() {}

    public CartItem(String beverageId, String beverageName, double price, int quantity) {
        this.beverageId = beverageId;
        this.beverageName = beverageName;
        this.price = price;
        this.quantity = quantity;
    }

    public void increaseQuantity() {
        this.quantity++;
    }

    public double getSubtotal() {
        return price * quantity;
    }

    public String getBeverageId() { return beverageId; }
    public String getBeverageName() { return beverageName; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) { this.quantity = quantity; }
}
