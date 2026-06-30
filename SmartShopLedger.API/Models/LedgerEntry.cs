using System.ComponentModel.DataAnnotations;

namespace SmartShopLedger.API.Models;

public class LedgerEntry
{
    public int Id { get; set; }

    [Required, MaxLength(10)]
    public string Type { get; set; } = "Debit";

    [Required]
    public decimal Amount { get; set; }

    [MaxLength(50)]
    public string? ReferenceType { get; set; }

    public int? ReferenceId { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime EntryDate { get; set; } = DateTime.UtcNow;

    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public int? SupplierId { get; set; }
    public Supplier? Supplier { get; set; }
}
