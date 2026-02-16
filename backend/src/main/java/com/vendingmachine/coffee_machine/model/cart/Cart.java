package com.vendingmachine.coffee_machine.model.cart;

import com.vendingmachine.coffee_machine.model.Beverage;
import com.vendingmachine.coffee_machine.model.cart.CartItem;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "cart")
public class Cart {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private Map<String, CartItem> items = new HashMap<>();

    public void addItem(Beverage beverage) {
        String beverageId = beverage.getId();

        if (items.containsKey(beverageId)) {
            items.get(beverageId).increaseQuantity();
        } else {
            items.put(beverageId,
                    new CartItem(
                            beverage.getId(),
                            beverage.getName(),
                            beverage.getPrice(),
                            1
                    ));
        }
    }

    public void removeItem(String beverageId) {
        items.remove(beverageId);
    }

    public Collection<CartItem> getItems() {
        return items.values();
    }

    public double getTotalAmount() {
        return items.values()
                .stream()
                .mapToDouble(CartItem::getSubtotal)
                .sum();
    }

    public void clear() {
        items.clear();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    //GETTERS & SETTERS
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Map<String, CartItem> getItemsMap() { return items; }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
