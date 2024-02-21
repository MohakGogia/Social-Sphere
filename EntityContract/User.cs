using System.ComponentModel.DataAnnotations.Schema;

namespace EntityContract
{
    [Table("Users")]
    public class User : BaseEntity
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset DateOfBirth { get; set; }
        public DateTimeOffset LastActive { get; set; } = DateTimeOffset.UtcNow;
        public string Gender { get; set; }
        public bool IsInactive { get; set; }
        public string Bio { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string ProfileImageUrl { get; set; }
        public string ProfileImagePublicId{ get; set; }
        public ICollection<Post> Posts { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}
