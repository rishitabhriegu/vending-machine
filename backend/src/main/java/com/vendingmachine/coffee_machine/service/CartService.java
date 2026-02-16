package com.vendingmachine.coffee_machine.service;

import com.vendingmachine.coffee_machine.model.Beverage;
import com.vendingmachine.coffee_machine.model.Receipt;
import com.vendingmachine.coffee_machine.model.ReceiptItem;
import com.vendingmachine.coffee_machine.model.cart.Cart;
import com.vendingmachine.coffee_machine.repository.BeverageRepository;
import com.vendingmachine.coffee_machine.repository.CartRepository;
import com.vendingmachine.coffee_machine.repository.ReceiptRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartService {
    private final BeverageRepository beverageRepository;
    private final ReceiptRepository receiptRepository;
    private final CartRepository cartRepository;

    public CartService(BeverageRepository beverageRepository, ReceiptRepository receiptRepository, CartRepository cartRepository) {
        this.beverageRepository = beverageRepository;
        this.receiptRepository = receiptRepository;
        this.cartRepository = cartRepository;
    }

    //Add to Cart Login
    public Cart addToCart(String beverageId, Authentication authentication) {

        String username = authentication.getName();

        Beverage beverage = beverageRepository.findById(beverageId)
                .orElseThrow(() -> new RuntimeException("Beverage not found"));

        Cart cart = cartRepository.findByUsername(username)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUsername(username);
                    return newCart;
                });

        cart.addItem(beverage);

        return cartRepository.save(cart);
    }

    //Removing From Cart Login
    public Cart removeFromCart(String beverageId, Authentication authentication) {

        String username = authentication.getName();

        Cart cart = cartRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.removeItem(beverageId);

        return cartRepository.save(cart);
    }

    //Display/View Cart
    public Cart viewCart(Authentication authentication) {
        String username = authentication.getName();
        return cartRepository.findByUsername(username)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUsername(username);
                    return cartRepository.save(cart);
                });
    }

    public void clearCart(Authentication authentication) {

        String username = authentication.getName();

        Cart cart = cartRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.clear();

        cartRepository.save(cart);
    }

    public Receipt checkout(Authentication authentication){
        String username = authentication.getName();

        Cart cart = cartRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Receipt receipt = new Receipt();
        receipt.setUsername(username);
        receipt.setTotalAmount(cart.getTotalAmount());

        List<ReceiptItem> receiptItems = cart.getItems().stream()
                .map(item -> {
                    ReceiptItem ri = new ReceiptItem(
                            item.getBeverageName(),
                            item.getQuantity(),
                            item.getPrice()
                    );

                    return ri;
                })
                .toList();

        receipt.setItems(receiptItems);
        receipt.setCreatedAt(LocalDateTime.now());
        receipt.setReceiptDate(LocalDate.now());
        receiptRepository.save(receipt);

        cart.clear();
        cartRepository.save(cart);

        return receipt;
    }
}
