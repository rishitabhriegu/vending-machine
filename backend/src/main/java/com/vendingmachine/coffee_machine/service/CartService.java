package com.vendingmachine.coffee_machine.service;

import com.vendingmachine.coffee_machine.model.Beverage;
import com.vendingmachine.coffee_machine.model.Receipt;
import com.vendingmachine.coffee_machine.model.ReceiptItem;
import com.vendingmachine.coffee_machine.model.cart.Cart;
import com.vendingmachine.coffee_machine.repository.BeverageRepository;
import com.vendingmachine.coffee_machine.repository.ReceiptRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartService {
    private final BeverageRepository beverageRepository;
    private final ReceiptRepository receiptRepository;
    private final Cart cart = new Cart();

    public CartService(BeverageRepository beverageRepository, ReceiptRepository receiptRepository) {
        this.beverageRepository = beverageRepository;
        this.receiptRepository = receiptRepository;
    }

    public Cart addToCart(String beverageId) {
        Beverage beverage = beverageRepository.findById(beverageId)
                .orElseThrow(() -> new RuntimeException("Beverage not found"));

        cart.addItem(beverage);
        return cart;
    }

    public Cart removeFromCart(String beverageId) {
        cart.removeItem(beverageId);
        return cart;
    }

    public Cart viewCart() {
        return cart;
    }

    public void clearCart() {
        cart.clear();
    }

    public Receipt checkout(){
        if(cart.isEmpty()){
            throw new RuntimeException("Cart is empty");
        }
        List<ReceiptItem> receiptItems = cart.getItems()
                .stream()
                .map(item -> new ReceiptItem(
                        item.getBeverage().getName(),
                        item.getQuantity(),
                        item.getBeverage().getPrice()
                ))
                .toList();

        double total = cart.getTotalAmount();;
        Receipt receipt = new Receipt(receiptItems, total);
        LocalDateTime now = LocalDateTime.now();
        Receipt savedReceipt = receiptRepository.save(receipt);
        cart.clear();
        return savedReceipt;
    }
}
