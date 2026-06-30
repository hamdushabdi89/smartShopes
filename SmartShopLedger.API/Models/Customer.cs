using System.ComponentModel.DataAnnotations;

namespace SmartShopLedger.API.Models;

public class Customer
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }

    public decimal Balance { get; set; }

    public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    public ICollection<LedgerEntry> LedgerEntries { get; set; } = new List<LedgerEntry>();
}
