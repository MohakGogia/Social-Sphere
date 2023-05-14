using System.ComponentModel.DataAnnotations.Schema;

namespace EntityContract
{
    [Table("Users")]
    public class User : BaseEntity
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset DateOfBirth { get; set; }
        public char Gender { get; set; }
        public bool IsInactive { get; set; }
        public List<Post> Posts { get; set; } = new List<Post>();
    }
}