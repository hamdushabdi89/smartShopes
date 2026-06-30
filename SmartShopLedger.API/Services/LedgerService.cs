using Microsoft.EntityFrameworkCore;
using SmartShopLedger.API.Data;
using SmartShopLedger.API.DTOs;
using SmartShopLedger.API.Models;

namespace SmartShopLedger.API.Services;

public interface ILedgerService
{
    Task<List<LedgerEntryDto>> GetAllAsync(int? customerId, int? supplierId, DateTime? from, DateTime? to);
    Task<LedgerEntryDto> CreateAsync(CreateLedgerEntryDto dto);
}

public class LedgerService : ILedgerService
{
    private readonly AppDbContext _context;

    public LedgerService(AppDbContext context) => _context = context;

    public async Task<List<LedgerEntryDto>> GetAllAsync(int? customerId, int? supplierId, DateTime? from, DateTime? to)
    {
        var query = _context.LedgerEntries
            .Include(le => le.Customer)
            .Include(le => le.Supplier)
            .AsQueryable();

        if (customerId.HasValue) query = query.Where(le => le.CustomerId == customerId);
        if (supplierId.HasValue) query = query.Where(le => le.SupplierId == supplierId);
        if (from.HasValue) query = query.Where(le => le.EntryDate >= from.Value);
        if (to.HasValue) query = query.Where(le => le.EntryDate <= to.Value);

        var entries = await query.OrderByDescending(le => le.EntryDate).ToListAsync();

        decimal runningBalance = 0;
        var result = new List<LedgerEntryDto>();

        foreach (var entry in entries.OrderBy(e => e.EntryDate))
        {
            if (entry.Type == "Debit")
                runningBalance += entry.Amount;
            else
                runningBalance -= entry.Amount;

            result.Add(new LedgerEntryDto
            {
                Id = entry.Id,
                Type = entry.Type,
                Amount = entry.Amount,
                ReferenceType = entry.ReferenceType,
                ReferenceId = entry.ReferenceId,
                Description = entry.Description,
                EntryDate = entry.EntryDate,
                CustomerName = entry.Customer?.Name,
                SupplierName = entry.Supplier?.Name,
                RunningBalance = runningBalance
            });
        }

        return result.OrderByDescending(e => e.EntryDate).ToList();
    }

    public async Task<LedgerEntryDto> CreateAsync(CreateLedgerEntryDto dto)
    {
        var entry = new LedgerEntry
        {
            Type = dto.Type,
            Amount = dto.Amount,
            ReferenceType = dto.ReferenceType,
            ReferenceId = dto.ReferenceId,
            Description = dto.Description,
            CustomerId = dto.CustomerId,
            SupplierId = dto.SupplierId,
            EntryDate = DateTime.UtcNow
        };

        if (dto.CustomerId.HasValue)
        {
            var customer = await _context.Customers.FindAsync(dto.CustomerId.Value);
            if (customer != null)
                customer.Balance += dto.Type == "Debit" ? dto.Amount : -dto.Amount;
        }

        if (dto.SupplierId.HasValue)
        {
            var supplier = await _context.Suppliers.FindAsync(dto.SupplierId.Value);
            if (supplier != null)
                supplier.Balance += dto.Type == "Debit" ? dto.Amount : -dto.Amount;
        }

        _context.LedgerEntries.Add(entry);
        await _context.SaveChangesAsync();
        await _context.Entry(entry).Reference(le => le.Customer).LoadAsync();
        await _context.Entry(entry).Reference(le => le.Supplier).LoadAsync();

        return new LedgerEntryDto
        {
            Id = entry.Id,
            Type = entry.Type,
            Amount = entry.Amount,
            ReferenceType = entry.ReferenceType,
            ReferenceId = entry.ReferenceId,
            Description = entry.Description,
            EntryDate = entry.EntryDate,
            CustomerName = entry.Customer?.Name,
            SupplierName = entry.Supplier?.Name,
            RunningBalance = 0
        };
    }
}
