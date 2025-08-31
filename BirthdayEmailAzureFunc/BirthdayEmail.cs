using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace BirthdayEmail;

public class BirthdayEmail
{
    private readonly ILogger _logger;
    private readonly string _connectionString;
    private readonly string _sendGridApiKey;

    public BirthdayEmail(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<BirthdayEmail>();
        _connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
        _sendGridApiKey = Environment.GetEnvironmentVariable("SendGridApiKey");
    }

    // Every 3 mins
    [Function("BirthdayEmail")]
    public async Task Run([TimerTrigger("0 */3 * * * *")] TimerInfo myTimer)
    {
        _logger.LogInformation("C# Timer trigger function executed at: {executionTime}", DateTime.Now);

        if (myTimer.ScheduleStatus is not null)
        {
            _logger.LogInformation("Next timer schedule at: {nextSchedule}", myTimer.ScheduleStatus.Next);
        }

        // var connStr = _cfg["SqlConnectionString"];
        // var todayIst = DateTimeOffset.UtcNow.ToOffset(TimeSpan.FromHours(5.5)).Date;
        // var month = todayIst.Month;
        // var day = todayIst.Day;

        // using var conn = new SqlConnection(connStr);
        // await conn.OpenAsync();

        // var users = await conn.QueryAsync<(int Id, string Email, string DisplayName)>(
        //     "SELECT Id, Email, DisplayName FROM Users WHERE DateOfBirth IS NOT NULL AND MONTH(DateOfBirth)=@m AND DAY(DateOfBirth)=@d",
        //     new { m = month, d = day });

        // foreach (var u in users)
        // {
        //     // Send birthday email
        // }
    }
}