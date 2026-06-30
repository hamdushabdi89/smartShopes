using Microsoft.EntityFrameworkCore;
using SmartShopLedger.API.Data;
using SmartShopLedger.API.DTOs;
using SmartShopLedger.API.Models;

namespace SmartShopLedger.API.Services;

public interface ISupplierService
{
    Task<List<SupplierDto>> GetAllAsync(string? search);
    Task<SupplierDto?> GetByIdAsync(int id);
    Task<SupplierDto> CreateAsync(CreateSupplierDto dto);
    Task<SupplierDto?> UpdateAsync(int id, UpdateSupplierDto dto);
    Task<bool> DeleteAsync(int id);
}

public class SupplierService : ISupplierService
{
    private readonly AppDbContext _context;

    public SupplierService(AppDbContext context) => _context = context;

    public async Task<List<SupplierDto>> GetAllAsync(string? search)
    {
        var query = _context.Suppliers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => s.Name.Contains(search) || (s.Phone != null && s.Phone.Contains(search)));
        return await query.OrderByDescending(s => s.Id).Select(s => new SupplierDto
        {
            Id = s.Id,
            Name = s.Name,
            Phone = s.Phone,
            Balance = s.Balance
        }).ToListAsync();
    }

    public async Task<SupplierDto?> GetByIdAsync(int id)
    {
        var s = await _context.Suppliers.FindAsync(id);
        return s == null ? null : new SupplierDto { Id = s.Id, Name = s.Name, Phone = s.Phone, Balance = s.Balance };
    }

    public async Task<SupplierDto> CreateAsync(CreateSupplierDto dto)
    {
        var supplier = new Supplier { Name = dto.Name, Phone = dto.Phone };
        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync();
        return new SupplierDto { Id = supplier.Id, Name = supplier.Name, Phone = supplier.Phone, Balance = supplier.Balance };
    }

    public async Task<SupplierDto?> UpdateAsync(int id, UpdateSupplierDto dto)
    {
        var s = await _context.Suppliers.FindAsync(id);
        if (s == null) return null;
        s.Name = dto.Name;
        s.Phone = dto.Phone;
        await _context.SaveChangesAsync();
        return new SupplierDto { Id = s.Id, Name = s.Name, Phone = s.Phone, Balance = s.Balance };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var s = await _context.Suppliers.FindAsync(id);
        if (s == null) return false;
        _context.Suppliers.Remove(s);
        await _context.SaveChangesAsync();
        return true;
    }
}
