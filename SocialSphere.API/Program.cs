using System.Text.Json.Serialization;
using Core.Configuration;
using Core.Middlewares;
using DataAccess;
using DataAccess.Interfaces;
using EntityContract;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;
using Serilog;
using Service;
using Service.Interfaces;
using Service.Interfaces.Notifications;
using Service.Notifications;
using SocialSphere.API;


var builder = WebApplication.CreateBuilder(args);

var env_Name = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

builder.Configuration.SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env_Name ?? "Production"}.json", optional: true)
          .AddEnvironmentVariables()
          .Build();

var configuration = builder.Configuration;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = configuration["IdentityServerUrl"];
    options.Audience = configuration["WebApiName"];
    options.RequireHttpsMetadata = false;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true);
    });
});

IdentityModelEventSource.ShowPII = true;

builder.Services.AddControllers(opt => opt.AllowEmptyInputInBodyModelBinding = true)
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);


#region Repositories

builder.Services.AddScoped<IUserRepository, UserRepository>();

#endregion


#region Services

builder.Services
    .AddScoped<IUserService, UserService>()
    .AddSingleton<INotificationService, NotificationService>();

#endregion

AddConfigurationModels(builder.Services);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo { Title = "Social Sphere API", Version = "v1" }));
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddTransient<GlobalExceptionHandlerMiddleware>();
builder.Services.AddSignalR();
builder.Services.AddDbContext<SocialSphereDBContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                                                     options => options.CommandTimeout(120)));

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();

builder.Host.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddSerilog();
});

var app = builder.Build();


// Configure DBContext and apply any pending migrations
using (var serviceScope = app.Services.CreateScope())
{
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<SocialSphereDBContext>();

    var isMigrationPending = dbContext.Database.GetPendingMigrations().Any();

    if (isMigrationPending)
    {
        dbContext.Database.Migrate();
    }
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");
app.Run();



void AddConfigurationModels(IServiceCollection services)
{
    var notificationsConfig = new Notifications();
    configuration.GetSection("Notifications").Bind(notificationsConfig);
    services.AddSingleton(notificationsConfig);
}
