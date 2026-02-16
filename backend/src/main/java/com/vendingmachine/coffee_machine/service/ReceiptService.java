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
        List<Receipt> receipts = receiptRepository.findByReceiptDate(today);

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

        return new DailySalesResponse(today, itemCounts, totalRevenue);
    }

    public void sendDailySalesEmail() {

        DailySalesResponse sales = getTodaySales();

        StringBuilder body = new StringBuilder();
        body.append("Daily Sales Report\n\n");
        body.append("Date: ").append(sales.getDate()).append("\n\n");

        sales.getItemCounts().forEach((item, count) ->
                body.append(item)
                        .append(" : ")
                        .append(count)
                        .append("\n")
        );

        body.append("\nTotal Revenue: ₹")
                .append(sales.getTotalRevenue());

        emailService.sendEmail(
                "rishitabhriegu@infrrd.ai",
                "Daily Sales Report",
                body.toString()
        );
    }

}
