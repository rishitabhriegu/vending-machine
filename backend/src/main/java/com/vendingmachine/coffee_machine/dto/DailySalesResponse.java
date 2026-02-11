package com.vendingmachine.coffee_machine.dto;

import java.time.LocalDate;
import java.util.Map;

public class DailySalesResponse {

    private LocalDate date;
    private Map<String, Integer> itemCounts;
    private double totalRevenue;

    public DailySalesResponse(LocalDate date,
                              Map<String, Integer> itemCounts,
                              double totalRevenue) {
        this.date = date;
        this.itemCounts = itemCounts;
        this.totalRevenue = totalRevenue;
    }

    public LocalDate getDate() {
        return date;
    }

    public Map<String, Integer> getItemCounts() {
        return itemCounts;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }
}
