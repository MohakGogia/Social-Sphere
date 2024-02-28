namespace EntityContract;

public class UserFollow : BaseEntity
{
    public User Follower { get; set; }
    public int FollowerId { get; set; }
    public User Following { get; set; }
    public int FollowingId { get; set; }
}
