using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShopLedger.API.DTOs;
using SmartShopLedger.API.Services;

namespace SmartShopLedger.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IProductService _productService;

    public InventoryController(IProductService productService) => _productService = productService;

    [HttpGet("stock-value")]
    public async Task<IActionResult> GetStockValue()
    {
        var products = await _productService.GetAllAsync(null, null, 1, int.MaxValue);
        var totalValue = products.Sum(p => p.CostPrice * p.StockQty);
        return Ok(new { totalStockValue = totalValue });
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var products = await _productService.GetAllAsync(null, null, 1, int.MaxValue);
        var lowStock = products.Where(p => p.StockQty <= p.ReorderLevel).ToList();
        return Ok(lowStock);
    }
}
