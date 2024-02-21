namespace EntityContract;

using System.ComponentModel.DataAnnotations.Schema;

[Table("Photos")]
public class Photo : BaseEntity
{
    public string Url { get; set; }
    public string PublicId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
}
