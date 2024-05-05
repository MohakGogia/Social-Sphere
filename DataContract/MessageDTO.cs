namespace DataContract;
using System;

public class MessageDTO
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string SenderUsername { get; set; }
    public string SenderPhotoUrl { get; set; }
    public int RecipientId { get; set; }
    public string RecipientUsername { get; set; }
    public string RecipientPhotoUrl { get; set; }
    public string Content { get; set; }
    public DateTimeOffset? DateRead { get; set; }
    public DateTimeOffset MessageSent { get; set; }
    public bool IsSenderDeleted { get; set; }
    public bool IsRecipientDeleted { get; set; }
}
