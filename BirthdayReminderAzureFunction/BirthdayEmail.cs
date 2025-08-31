namespace BirthdayReminderAzureFunction;

using System;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;

public class BirthdayEmail
{
    private readonly ILogger logger;
    private readonly string connectionString;
    private readonly string sendGridApiKey;
    private readonly string sendGridFromEmail;
    private readonly bool isHeartbeatEnabled;

    public BirthdayEmail(ILoggerFactory loggerFactory)
    {
        logger = loggerFactory.CreateLogger<BirthdayEmail>();
        connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
        sendGridApiKey = Environment.GetEnvironmentVariable("SendGridApiKey");
        sendGridFromEmail = Environment.GetEnvironmentVariable("SendGridFromEmail");
        isHeartbeatEnabled = Convert.ToBoolean(
            Environment.GetEnvironmentVariable("IsHeartbeatEnabled") ?? "true"
        );
    }

    // Runs daily at 00:00 IST → 18:30 UTC
    [Function("BirthdayEmail")]
    public async Task Run([TimerTrigger("0 30 18 * * *")] TimerInfo myTimer)
    {
        if (!isHeartbeatEnabled)
        {
            logger.LogInformation("Heartbeat is turned off");
            return;
        }

        logger.LogInformation("BirthdayEmail function started at {time}", DateTime.UtcNow);

        if (string.IsNullOrWhiteSpace(connectionString) || string.IsNullOrWhiteSpace(sendGridApiKey)
                || string.IsNullOrWhiteSpace(sendGridFromEmail))
        {
            logger.LogError("Missing required configuration (SqlConnectionString / SendGridApiKey | SendGridFromEmail).");
            return;
        }

        var todayIst = DateTimeOffset.UtcNow.ToOffset(TimeSpan.FromHours(5.5)).Date;
        var month = todayIst.Month;
        var day = todayIst.Day;

        const string findBirthdaysSql = @"
                SELECT Id, UserName, Email
                FROM   Users
                WHERE  IsInactive = 0
                  AND  DateOfBirth IS NOT NULL
                  AND  MONTH(SWITCHOFFSET(DateOfBirth, '+05:30')) = @m
                  AND  DAY  (SWITCHOFFSET(DateOfBirth, '+05:30')) = @d;
                ";

        int candidates = 0, sent = 0;

        using var conn = new SqlConnection(connectionString);
        await conn.OpenAsync();

        using var cmd = new SqlCommand(findBirthdaysSql, conn);
        cmd.Parameters.AddWithValue("@m", month);
        cmd.Parameters.AddWithValue("@d", day);

        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            candidates++;
            var userId = reader.GetInt32(0);
            var userName = reader.GetString(1);
            var email = reader.GetString(2);

            var ok = await SendEmailAsync(email, userName);
            if (ok)
            {
                sent++;
            }
        }

        logger.LogInformation("BirthdayEmail finished: candidates={c}, sent={s}", candidates, sent);
    }

    private async Task<bool> SendEmailAsync(string toEmail, string userName)
    {
        try
        {
            var client = new SendGridClient(sendGridApiKey);
            var from = new EmailAddress(sendGridFromEmail, "Social Sphere");
            var subject = "Happy Birthday 🎉";
            var plainText = $"Happy Birthday, {userName}! 🎂 Have a great day on Social Sphere!";
            var htmlContent = $"<p>Happy Birthday, <b>{userName}</b>! 🎂🎉</p><p>Have a wonderful day on Social Sphere!</p>";
            var msg = MailHelper.CreateSingleEmail(from, new EmailAddress(toEmail, userName), subject, plainText, htmlContent);

            var response = await client.SendEmailAsync(msg);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send email to {email}", toEmail);
            return false;
        }
    }
}
