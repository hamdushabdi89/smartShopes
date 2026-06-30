using Microsoft.EntityFrameworkCore;
using SmartShopLedger.API.Data;
using SmartShopLedger.API.DTOs;

namespace SmartShopLedger.API.Services;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
}

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context) => _context = context;

    public async Task<DashboardSummaryDto> GetSummaryAsync()
    {
        var today = DateTime.UtcNow.Date;

        var totalSalesToday = await _context.Sales
            .Where(s => s.SaleDate >= today)
            .SumAsync(s => s.TotalAmount);

        var totalStockValue = await _context.Products
            .SumAsync(p => p.CostPrice * p.StockQty);

        var outstandingDebt = await _context.Customers
            .SumAsync(c => c.Balance);

        var lowStockCount = await _context.Products
            .CountAsync(p => p.StockQty <= p.ReorderLevel);

        var salesChart = await _context.Sales
            .Where(s => s.SaleDate >= today.AddDays(-6))
            .GroupBy(s => s.SaleDate.Date)
            .Select(g => new SalesChartData
            {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Amount = g.Sum(s => s.TotalAmount)
            })
            .ToListAsync();

        var last7Days = Enumerable.Range(0, 7)
            .Select(i => today.AddDays(i).ToString("yyyy-MM-dd"))
            .ToList();

        var chartData = last7Days.Select(date => new SalesChartData
        {
            Date = date,
            Amount = salesChart.FirstOrDefault(c => c.Date == date)?.Amount ?? 0
        }).ToList();

        return new DashboardSummaryDto
        {
            TotalSalesToday = totalSalesToday,
            TotalStockValue = totalStockValue,
            OutstandingCustomerDebt = outstandingDebt,
            LowStockCount = lowStockCount,
            SalesChart = chartData
        };
    }
}
