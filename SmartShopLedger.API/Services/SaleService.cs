using Microsoft.EntityFrameworkCore;
using SmartShopLedger.API.Data;
using SmartShopLedger.API.DTOs;
using SmartShopLedger.API.Models;

namespace SmartShopLedger.API.Services;

public interface ISaleService
{
    Task<List<SaleDto>> GetAllAsync(DateTime? from, DateTime? to, int page, int pageSize);
    Task<SaleDto?> GetByIdAsync(int id);
    Task<SaleDto> CreateAsync(CreateSaleDto dto, int userId);
}

public class SaleService : ISaleService
{
    private readonly AppDbContext _context;

    public SaleService(AppDbContext context) => _context = context;

    public async Task<List<SaleDto>> GetAllAsync(DateTime? from, DateTime? to, int page, int pageSize)
    {
        var query = _context.Sales
            .Include(s => s.Customer)
            .Include(s => s.User)
            .Include(s => s.SaleItems).ThenInclude(si => si.Product)
            .AsQueryable();

        if (from.HasValue) query = query.Where(s => s.SaleDate >= from.Value);
        if (to.HasValue) query = query.Where(s => s.SaleDate <= to.Value);

        return await query
            .OrderByDescending(s => s.SaleDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new SaleDto
            {
                Id = s.Id,
                CustomerId = s.CustomerId,
                CustomerName = s.Customer != null ? s.Customer.Name : "Walk-in",
                TotalAmount = s.TotalAmount,
                PaidAmount = s.PaidAmount,
                Status = s.Status,
                SaleDate = s.SaleDate,
                UserName = s.User.Username,
                Items = s.SaleItems.Select(si => new SaleItemDto
                {
                    Id = si.Id,
                    ProductId = si.ProductId,
                    ProductName = si.Product.Name,
                    Quantity = si.Quantity,
                    UnitPrice = si.UnitPrice,
                    Subtotal = si.Subtotal
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<SaleDto?> GetByIdAsync(int id)
    {
        var s = await _context.Sales
            .Include(s => s.Customer)
            .Include(s => s.User)
            .Include(s => s.SaleItems).ThenInclude(si => si.Product)
            .FirstOrDefaultAsync(s => s.Id == id);
        return s == null ? null : MapToDto(s);
    }

    public async Task<SaleDto> CreateAsync(CreateSaleDto dto, int userId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            decimal totalAmount = 0;
            var saleItems = new List<SaleItem>();

            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId)
                    ?? throw new InvalidOperationException($"Product {item.ProductId} not found");

                if (product.StockQty < item.Quantity)
                    throw new InvalidOperationException($"Insufficient stock for {product.Name}");

                product.StockQty -= item.Quantity;

                var subtotal = product.Price * item.Quantity;
                totalAmount += subtotal;

                saleItems.Add(new SaleItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price,
                    Subtotal = subtotal
                });
            }

            var status = dto.PaidAmount >= totalAmount ? "Paid" : "Partial";
            if (dto.PaidAmount == 0) status = "Unpaid";

            var sale = new Sale
            {
                CustomerId = dto.CustomerId,
                TotalAmount = totalAmount,
                PaidAmount = dto.PaidAmount,
                Status = status,
                UserId = userId,
                SaleItems = saleItems
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            if (dto.CustomerId.HasValue && dto.PaidAmount < totalAmount)
            {
                var debtAmount = totalAmount - dto.PaidAmount;
                _context.LedgerEntries.Add(new LedgerEntry
                {
                    Type = "Debit",
                    Amount = debtAmount,
                    ReferenceType = "Sale",
                    ReferenceId = sale.Id,
                    Description = $"Debt from sale #{sale.Id}",
                    CustomerId = dto.CustomerId,
                    EntryDate = DateTime.UtcNow
                });

                var customer = await _context.Customers.FindAsync(dto.CustomerId.Value);
                if (customer != null) customer.Balance += debtAmount;
                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();
            await _context.Entry(sale).Reference(s => s.Customer).LoadAsync();
            await _context.Entry(sale).Reference(s => s.User).LoadAsync();
            await _context.Entry(sale).Collection(s => s.SaleItems).Query().Include(si => si.Product).LoadAsync();

            return MapToDto(sale);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static SaleDto MapToDto(Sale s) => new()
    {
        Id = s.Id,
        CustomerId = s.CustomerId,
        CustomerName = s.Customer?.Name ?? "Walk-in",
        TotalAmount = s.TotalAmount,
        PaidAmount = s.PaidAmount,
        Status = s.Status,
        SaleDate = s.SaleDate,
        UserName = s.User.Username,
        Items = s.SaleItems.Select(si => new SaleItemDto
        {
            Id = si.Id,
            ProductId = si.ProductId,
            ProductName = si.Product.Name,
            Quantity = si.Quantity,
            UnitPrice = si.UnitPrice,
            Subtotal = si.Subtotal
        }).ToList()
    };
}
