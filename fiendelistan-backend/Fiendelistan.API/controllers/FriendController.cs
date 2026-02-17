using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Fiendelistan.API.Data;
using Fiendelistan.API.Models;

namespace Fiendelistan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FriendController : ControllerBase
{
    private readonly AppDbContext _context;

    public FriendController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetFriends(string userId)
    {
        try
        {
            var friends = await _context.Friends
                .Where(f => f.UserId == userId)
                .Select(f => new {
                    f.Id,
                    f.UserId,
                    f.FriendUserId,
                    FriendName = _context.Users.Where(u => u.Id == f.FriendUserId).Select(u => u.Name).FirstOrDefault(),
                    FriendEmail = _context.Users.Where(u => u.Id == f.FriendUserId).Select(u => u.Email).FirstOrDefault(),
                    FriendShortId = _context.Users.Where(u => u.Id == f.FriendUserId).Select(u => u.ShortId).FirstOrDefault()
                })
                .ToListAsync();
            return Ok(friends);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpGet("search/{searchTerm}")]
    public async Task<IActionResult> SearchUsers(string searchTerm)
    {
        try
        {
            var users = await _context.Users
                .Where(u => u.Name.Contains(searchTerm) || 
                           u.Email.Contains(searchTerm) || 
                           u.ShortId == searchTerm)
                .Select(u => new { u.Id, u.Name, u.Email, u.ShortId, u.ProfileImageUrl })
                .Take(10) 
                .ToListAsync();
            
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddFriend([FromBody] AddFriendRequest request)
    {
        try
        {
            var friendUser = await _context.Users.FindAsync(request.FriendUserId);
            if (friendUser == null)
            {
                return BadRequest("Användaren finns inte");
            }

            var existingFriendship = await _context.Friends
                .FirstOrDefaultAsync(f => f.UserId == request.UserId && f.FriendUserId == request.FriendUserId);
            
            if (existingFriendship != null)
            {
                return BadRequest("Du är redan vän med denna person");
            }

            var newFriend = new Friend
            {
                UserId = request.UserId,
                FriendUserId = request.FriendUserId
            };

            _context.Friends.Add(newFriend);
            await _context.SaveChangesAsync();

            var friendWithInfo = await _context.Friends
                .Where(f => f.Id == newFriend.Id)
                .Select(f => new {
                    f.Id,
                    f.UserId,
                    f.FriendUserId,
                    FriendName = _context.Users.Where(u => u.Id == f.FriendUserId).Select(u => u.Name).FirstOrDefault(),
                    FriendEmail = _context.Users.Where(u => u.Id == f.FriendUserId).Select(u => u.Email).FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            return Ok(friendWithInfo);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpDelete("{friendshipId}")]
    public async Task<IActionResult> RemoveFriend(int friendshipId)
    {
        try
        {
            var friendship = await _context.Friends.FindAsync(friendshipId);
            if (friendship == null)
            {
                return NotFound("Vänskap hittades inte");
            }

            _context.Friends.Remove(friendship);
            await _context.SaveChangesAsync();

            return Ok("Vän borttagen");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }
}

public class AddFriendRequest
{
    public string UserId { get; set; } = string.Empty;
    public string FriendUserId { get; set; } = string.Empty; 
}