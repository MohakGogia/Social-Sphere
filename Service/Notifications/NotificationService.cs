namespace Service.Notifications;
using SendGrid.Helpers.Mail;
using SendGrid;
using DataContract;
using Service.Interfaces.Notifications;
using Core.Configuration;

public class NotificationService : INotificationService
{
    private readonly SendgridConfiguration sendgridConfiguration;
    public NotificationService(Notifications notificationsConfiguration)
    {
        sendgridConfiguration = notificationsConfiguration.Sendgrid;
    }

    Task<Response> INotificationService.SendEmailAsync(EmailNotificationDTO emailNotification)
    {
        var client = new SendGridClient(sendgridConfiguration.ApiKey);

        var mailSettings = new MailSettings();
        var sandboxMode = new SandboxMode
        {
            Enable = sendgridConfiguration.SandboxMode
        };
        mailSettings.SandboxMode = sandboxMode;

        var msg = new SendGridMessage()
        {
            Subject = emailNotification.Subject,
            TemplateId = emailNotification.TemplateId,
            From = new EmailAddress(sendgridConfiguration.FromEmail, sendgridConfiguration.FromName),
            ReplyTo = new EmailAddress(sendgridConfiguration.FromEmail, sendgridConfiguration.FromName)
        };

        if (emailNotification.Receivers?.Count() > 0)
        {
            msg.AddTos(emailNotification.Receivers.Select(receiver => new EmailAddress(receiver.email, receiver.fromName)).ToList());
        }

        if (emailNotification.CcReceivers?.Count() > 0)
        {
            msg.AddCcs(emailNotification.CcReceivers.Select(receiver => new EmailAddress(receiver.email, receiver.fromName)).ToList());
        }

        if (emailNotification.BccReceivers?.Count() > 0)
        {
            msg.AddBccs(emailNotification.BccReceivers.Select(receiver => new EmailAddress(receiver.email, receiver.fromName)).ToList());
        }

        msg.MailSettings = mailSettings;
        return client.SendEmailAsync(msg);
    }

}
