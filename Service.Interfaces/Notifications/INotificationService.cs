namespace Service.Interfaces.Notifications;
using System.Threading.Tasks;
using DataContract;
using SendGrid;

public interface INotificationService
{
    Task<Response> SendEmailAsync(EmailNotificationDTO emailNotification);
}
