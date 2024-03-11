namespace EntityContract;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Messages")]

public class Message : BaseEntity
{
    public int SenderId { get; set; }
    public User Sender { get; set; }
    public string SenderUsername { get; set; }
    public int RecipientId { get; set; }
    public User Recipient { get; set; }
    public string RecipientUsername { get; set; }
    public string Content { get; set; }
    public DateTimeOffset MessageSent { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? DateRead { get; set; }
    public bool IsSenderDeleted { get; set; }
    public bool IsRecipientDeleted { get; set; }
}
