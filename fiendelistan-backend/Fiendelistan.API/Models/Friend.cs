namespace Fiendelistan.API.Models;

public class Friend
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;              public string FriendUserId { get; set; } = string.Empty;   

    public User? User { get; set; }                                public User? FriendUser { get; set; }                       
}
