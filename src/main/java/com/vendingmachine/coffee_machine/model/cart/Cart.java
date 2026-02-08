package com.vendingmachine.coffee_machine.model.cart;

import com.vendingmachine.coffee_machine.model.Beverage;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class Cart {

    private Map<String, CartItem> items = new HashMap<>();

    public void addItem(Beverage beverage){
        String beverageId = beverage.getId();

        if(items.containsKey(beverageId))
            items.get(beverageId).increaseQuantity();
        else
            items.put(beverageId, new CartItem(beverage, 1));
    }

    public void removeItem(String beverageId){
        items.remove(beverageId);
    }

    public Collection<CartItem> getItems(){
        return items.values();
    }

    public double getTotalAmount() {
        return items.values()
                .stream()
                .mapToDouble(CartItem::getSubTotal)
                .sum();
    }

    public void clear() {
        items.clear();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

}
