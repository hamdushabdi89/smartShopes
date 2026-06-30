using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartShopLedger.API.DTOs;
using SmartShopLedger.API.Services;

namespace SmartShopLedger.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LedgerController : ControllerBase
{
    private readonly ILedgerService _ledgerService;

    public LedgerController(ILedgerService ledgerService) => _ledgerService = ledgerService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? customerId, [FromQuery] int? supplierId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var entries = await _ledgerService.GetAllAsync(customerId, supplierId, from, to);
        return Ok(entries);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLedgerEntryDto dto)
    {
        var entry = await _ledgerService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = entry.Id }, entry);
    }
}
