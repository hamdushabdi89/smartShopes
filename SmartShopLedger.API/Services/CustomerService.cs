using Microsoft.EntityFrameworkCore;
using SmartShopLedger.API.Data;
using SmartShopLedger.API.DTOs;
using SmartShopLedger.API.Models;

namespace SmartShopLedger.API.Services;

public interface ICustomerService
{
    Task<List<CustomerDto>> GetAllAsync(string? search);
    Task<CustomerDto?> GetByIdAsync(int id);
    Task<CustomerDto> CreateAsync(CreateCustomerDto dto);
    Task<CustomerDto?> UpdateAsync(int id, UpdateCustomerDto dto);
    Task<bool> DeleteAsync(int id);
}

public class CustomerService : ICustomerService
{
    private readonly AppDbContext _context;

    public CustomerService(AppDbContext context) => _context = context;

    public async Task<List<CustomerDto>> GetAllAsync(string? search)
    {
        var query = _context.Customers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c => c.Name.Contains(search) || (c.Phone != null && c.Phone.Contains(search)));
        return await query.OrderByDescending(c => c.Id).Select(c => new CustomerDto
        {
            Id = c.Id,
            Name = c.Name,
            Phone = c.Phone,
            Balance = c.Balance
        }).ToListAsync();
    }

    public async Task<CustomerDto?> GetByIdAsync(int id)
    {
        var c = await _context.Customers.FindAsync(id);
        return c == null ? null : new CustomerDto { Id = c.Id, Name = c.Name, Phone = c.Phone, Balance = c.Balance };
    }

    public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto)
    {
        var customer = new Customer { Name = dto.Name, Phone = dto.Phone };
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return new CustomerDto { Id = customer.Id, Name = customer.Name, Phone = customer.Phone, Balance = customer.Balance };
    }

    public async Task<CustomerDto?> UpdateAsync(int id, UpdateCustomerDto dto)
    {
        var c = await _context.Customers.FindAsync(id);
        if (c == null) return null;
        c.Name = dto.Name;
        c.Phone = dto.Phone;
        await _context.SaveChangesAsync();
        return new CustomerDto { Id = c.Id, Name = c.Name, Phone = c.Phone, Balance = c.Balance };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var c = await _context.Customers.FindAsync(id);
        if (c == null) return false;
        _context.Customers.Remove(c);
        await _context.SaveChangesAsync();
        return true;
    }
}
