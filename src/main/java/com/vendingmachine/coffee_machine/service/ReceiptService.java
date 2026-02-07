package com.vendingmachine.coffee_machine.service;

import com.vendingmachine.coffee_machine.dto.DailySalesResponse;
import com.vendingmachine.coffee_machine.model.Receipt;
import com.vendingmachine.coffee_machine.model.ReceiptItem;
import com.vendingmachine.coffee_machine.repository.ReceiptRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final EmailService emailService;

    public ReceiptService(ReceiptRepository receiptRepository, EmailService emailService) {
        this.receiptRepository = receiptRepository;
        this.emailService = emailService;
    }

    public DailySalesResponse getTodaySales() {

        LocalDate today = LocalDate.now();

        List<Receipt> receipts =
                receiptRepository.findByReceiptDate(today);

        Map<String, Integer> itemCounts = new HashMap<>();
        double totalRevenue = 0;

        for (Receipt receipt : receipts) {

            totalRevenue += receipt.getTotalAmount();

            for (ReceiptItem item : receipt.getItems()) {
                itemCounts.merge(
                        item.getBeverageName(),
                        item.getQuantity(),
                        Integer::sum
                );
            }
        }

        DailySalesResponse response =
                new DailySalesResponse(today, itemCounts, totalRevenue);

        //Build Email Body
        StringBuilder body = new StringBuilder();
        body.append("Daily Sales Report\n\n");
        body.append("Date: ").append(today).append("\n\n");

        itemCounts.forEach((item, count) ->
                body.append(item)
                        .append(" : ")
                        .append(count)
                        .append("\n")
        );

        body.append("\nTotal Revenue: ₹")
                .append(totalRevenue);

        //Send Email Immediately
        emailService.sendEmail(
                "rishitabhriegu17@gmail.com",
                "Daily Sales Report",
                body.toString()
        );

        return response;
    }
}
