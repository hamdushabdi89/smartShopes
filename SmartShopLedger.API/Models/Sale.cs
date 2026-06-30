using System.ComponentModel.DataAnnotations;

namespace SmartShopLedger.API.Models;

public class Sale
{
    public int Id { get; set; }

    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    [Required]
    public decimal TotalAmount { get; set; }

    [Required]
    public decimal PaidAmount { get; set; }

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Completed";

    public DateTime SaleDate { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
}
