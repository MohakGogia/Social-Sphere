using Core.Middlewares;
using DataAccess;
using DataAccess.Interfaces;
using EntityContract;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Service;
using Service.Interfaces;
using SocialSphere.API;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddTransient<GlobalExceptionHandlerMiddleware>();
builder.Services.AddSignalR();
builder.Services.AddDbContext<SocialSphereDBContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                                                     options => options.CommandTimeout(120)));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()
               .SetIsOriginAllowed(_ => true);
    });
});


#region Repositories

builder.Services.AddScoped<IUserRepository, UserRepository>();

#endregion


#region Services

builder.Services.AddScoped<IUserService, UserService>();

#endregion

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();

builder.Host.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddSerilog();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



// Configure DBContext and apply any pending migrations
using (var serviceScope = app.Services.CreateScope())
{
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<SocialSphereDBContext>();
    dbContext.Database.EnsureCreated();

    var isMigrationPending = dbContext.Database.GetPendingMigrations().Any();

    if (isMigrationPending)
    {
        dbContext.Database.Migrate();
    }
}

app.UseHttpsRedirection();
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
app.MapControllers();
// Configure SignalR
app.UseRouting();
app.UseAuthorization();
app.UseCors("AllowAll");
app.MapHub<ChatHub>("/chatHub");
app.Run();
