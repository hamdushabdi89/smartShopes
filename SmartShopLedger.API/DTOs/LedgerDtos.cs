namespace SmartShopLedger.API.DTOs;

public class LedgerEntryDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? ReferenceType { get; set; }
    public int? ReferenceId { get; set; }
    public string? Description { get; set; }
    public DateTime EntryDate { get; set; }
    public string? CustomerName { get; set; }
    public string? SupplierName { get; set; }
    public decimal RunningBalance { get; set; }
}

public class CreateLedgerEntryDto
{
    public string Type { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? ReferenceType { get; set; }
    public int? ReferenceId { get; set; }
    public string? Description { get; set; }
    public int? CustomerId { get; set; }
    public int? SupplierId { get; set; }
}
