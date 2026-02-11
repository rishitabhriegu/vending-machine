package com.vendingmachine.coffee_machine.controller;

import com.vendingmachine.coffee_machine.model.Receipt;
import com.vendingmachine.coffee_machine.model.cart.Cart;
import com.vendingmachine.coffee_machine.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add/{beverageId}")
    public Cart addToCart(@PathVariable String beverageId) {
        return cartService.addToCart(beverageId);
    }

    @DeleteMapping("/remove/{beverageId}")
    public Cart removeFromCart(@PathVariable String beverageId) {
        return cartService.removeFromCart(beverageId);
    }

    @GetMapping
    public Cart viewCart() {
        return cartService.viewCart();
    }

    @PostMapping("/checkout")
    public Receipt checkout(){
        return cartService.checkout();
    }
}
