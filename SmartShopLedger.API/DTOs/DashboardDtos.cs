namespace SmartShopLedger.API.DTOs;

public class DashboardSummaryDto
{
    public decimal TotalSalesToday { get; set; }
    public decimal TotalStockValue { get; set; }
    public decimal OutstandingCustomerDebt { get; set; }
    public int LowStockCount { get; set; }
    public List<SalesChartData> SalesChart { get; set; } = new();
}

public class SalesChartData
{
    public string Date { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
