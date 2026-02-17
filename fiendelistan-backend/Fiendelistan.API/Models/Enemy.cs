namespace Fiendelistan.API.Models;

public class Enemy
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public int Rank { get; set; }

    public string OwnerUserId { get; set; } = string.Empty; 
    public User? Owner { get; set; }                      
}
