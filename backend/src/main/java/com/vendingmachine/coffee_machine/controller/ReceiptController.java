package com.vendingmachine.coffee_machine.controller;

import com.vendingmachine.coffee_machine.dto.DailySalesResponse;
import com.vendingmachine.coffee_machine.service.ReceiptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/receipts")
public class ReceiptController {
    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @GetMapping("/daily-sales")
    public DailySalesResponse getTodaySales() {
        return receiptService.getTodaySales();
    }

    @PostMapping("/daily-sales/email")
    public ResponseEntity<String> sendDailySalesEmail() {
        receiptService.sendDailySalesEmail();
        return ResponseEntity.ok("Email sent successfully");
    }
}
