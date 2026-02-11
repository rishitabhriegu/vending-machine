package com.vendingmachine.coffee_machine.model.cart;

import com.vendingmachine.coffee_machine.model.Beverage;

public class CartItem {
    private Beverage beverage;
    private int quantity;

    public CartItem(Beverage beverage, int quantity) {
        this.beverage = beverage;
        this.quantity = quantity;
    }

    public Beverage getBeverage() {
        return beverage;
    }

    public int getQuantity() {
        return quantity;
    }

    public void increaseQuantity() {
        this.quantity++;
    }

    public double getSubTotal() {
        return beverage.getPrice() * quantity;
    }
}
