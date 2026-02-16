package com.vendingmachine.coffee_machine.controller;

import com.vendingmachine.coffee_machine.model.Receipt;
import com.vendingmachine.coffee_machine.model.cart.Cart;
import com.vendingmachine.coffee_machine.service.CartService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add/{beverageId}")
    public Cart addToCart(@PathVariable String beverageId, Authentication authentication) {
        return cartService.addToCart(beverageId, authentication);
    }

    @DeleteMapping("/remove/{beverageId}")
    public Cart removeFromCart(@PathVariable String beverageId,
                               Authentication authentication) {
        return cartService.removeFromCart(beverageId, authentication);
    }

    @GetMapping
    public Cart viewCart(Authentication authentication) {
        return cartService.viewCart(authentication);
    }

    @PostMapping("/checkout")
    public Receipt checkout(Authentication authentication){
        return cartService.checkout(authentication);
    }
}
