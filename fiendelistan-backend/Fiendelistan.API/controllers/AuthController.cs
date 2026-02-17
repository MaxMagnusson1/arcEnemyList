using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Fiendelistan.API.Data;
using Fiendelistan.API.Models;

namespace Fiendelistan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] GoogleLoginRequest request)
    {
        try
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.GoogleId == request.GoogleId);

            if (existingUser != null)
            {
                existingUser.Name = request.Name;
                existingUser.Email = request.Email;
                await _context.SaveChangesAsync();
                return Ok(existingUser);
            }

            var newUser = new User
            {
                GoogleId = request.GoogleId,
                Email = request.Email,
                Name = request.Name,
                ProfileImageUrl = request.Picture ?? string.Empty,
                ShortId = GenerateShortId()
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(newUser);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _context.Users.ToListAsync();
            return Ok(new { 
                count = users.Count, 
                users = users 
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    private string GenerateShortId()
    {
        var random = new Random();
        return random.Next(1000, 9999).ToString();
    }
}

public class GoogleLoginRequest
{
    public string GoogleId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Picture { get; set; }
}