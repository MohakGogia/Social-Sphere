namespace Core.Configuration
{
    public class SendgridConfiguration
    {
        public string ApiKey { get; set; }
        public string FromEmail { get; set; }
        public string FromName { get; set; }
        public bool SandboxMode { get; set; }
    }

    public class Notifications
    {
        public SendgridConfiguration Sendgrid { get; set; }
    }
}
