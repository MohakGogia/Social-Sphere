using System.ComponentModel.DataAnnotations.Schema;

namespace EntityContract
{
    [Table("Posts")]
    public class Post : BaseEntity
    {
        public string Content { get; set; }

        [ForeignKey("User"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int PostedBy { get; set; }
        public virtual User User { get; set; }
    }
}