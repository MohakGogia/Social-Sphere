namespace DataContract;
using System.Collections.Generic;

public class EmailNotificationDTO
{
    public string Subject { get; set; }
    public string ReplyTo { get; set; }
    public string FromEmail { get; set; }
    public string TemplateId { get; set; }
    public IEnumerable<(string email, string fromName)> Receivers { get; set; }
    public IEnumerable<(string email, string fromName)> CcReceivers { get; set; }
    public IEnumerable<(string email, string fromName)> BccReceivers { get; set; }
}
