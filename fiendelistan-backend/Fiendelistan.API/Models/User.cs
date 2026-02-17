namespace Fiendelistan.API.Models;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();     public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string GoogleId { get; set; } = string.Empty;
    public string ShortId { get; set; } = string.Empty; 
    public string ProfileImageUrl { get; set; } = string.Empty;

    public List<Enemy> Enemies { get; set; } = new();
    public List<Friend> Friends { get; set; } = new();
}