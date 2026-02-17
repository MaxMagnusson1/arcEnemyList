using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Fiendelistan.API.Data;
using Fiendelistan.API.Models;

namespace Fiendelistan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnemyController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<EnemyController> _logger;  


    public EnemyController(AppDbContext context, ILogger<EnemyController> logger) 
    {
        _context = context;
        _logger = logger; 
    }

    [HttpGet]
    public async Task<IActionResult> GetAllEnemies()
    {
        try
        {
            var enemies = await _context.Enemies.ToListAsync();
            return Ok(enemies);
        }
        catch (Exception ex)
        {  
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetEnemiesByUser(string userId)
    {
        try
        {
            var enemies = await _context.Enemies
                .Where(e => e.OwnerUserId == userId)
                .OrderBy(e => e.Rank)
                .ToListAsync();
            return Ok(enemies);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

[HttpPost]
public async Task<IActionResult> CreateEnemy([FromBody] CreateEnemyRequest request)
{
    try
    {
        string userId = request.UserId ?? "temp-user";

        var enemies = await _context.Enemies
            .Where(e => e.OwnerUserId == userId)
            .OrderBy(e => e.Rank)
            .ToListAsync();

        int requestedRank = request.Rank;

        if (requestedRank < 1)
            requestedRank = 1;
        
        if (requestedRank > enemies.Count + 1)
            requestedRank = enemies.Count + 1;

        var enemiesToUpdate = enemies.Where(e => e.Rank >= requestedRank).ToList();
        
        foreach (var enemy in enemiesToUpdate)
        {
            enemy.Rank++;
        }

        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        // Skapa ny fiende
        var newEnemy = new Enemy
        {
            Name = request.Name,
            Reason = request.Reason,
            Rank = requestedRank,
            OwnerUserId = userId
        };

        _context.Enemies.Add(newEnemy);
        await _context.SaveChangesAsync();

        var updatedEnemies = await _context.Enemies
            .Where(e => e.OwnerUserId == userId)
            .OrderBy(e => e.Rank)
            .ToListAsync();

        return Ok(updatedEnemies);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating enemy: {Message}", ex.Message);
        return BadRequest($"Error: {ex.Message}\n{ex.InnerException?.Message}");
    }
}
    [HttpDelete("clear-all")]
    public async Task<IActionResult> ClearAllEnemies()
    {
        try
        {
            var allEnemies = await _context.Enemies.ToListAsync();
            _context.Enemies.RemoveRange(allEnemies);
            await _context.SaveChangesAsync();
            
            return Ok($"Cleared {allEnemies.Count} enemies from database");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEnemy(int id, [FromQuery] string? userId)
    {
        try
        {
            var enemy = await _context.Enemies.FindAsync(id);
            if (enemy == null)
                return NotFound($"Enemy with id {id} not found");

            if (string.IsNullOrEmpty(userId) || enemy.OwnerUserId != userId)
                return Unauthorized("You are not allowed to delete this enemy");

            int removedRank = enemy.Rank;

            _context.Enemies.Remove(enemy);
            await _context.SaveChangesAsync();

            var userEnemies = await _context.Enemies
                .Where(e => e.OwnerUserId == userId && e.Rank > removedRank)
                .ToListAsync();

            foreach (var e in userEnemies)
            {
                e.Rank--;
            }

            await _context.SaveChangesAsync();

            var updatedEnemies = await _context.Enemies
                .Where(e => e.OwnerUserId == userId)
                .OrderBy(e => e.Rank)
                .ToListAsync();

            return Ok(updatedEnemies);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting enemy: {Message}", ex.Message);
            return BadRequest($"Error: {ex.Message}");
        }
    }
}

public class CreateEnemyRequest
{
    public string Name { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public int Rank { get; set; } = 1;
    public string? UserId { get; set; } 
}