using System.IdentityModel.Tokens.Jwt;
using IdentityServer.Configuration;
using IdentityServer.Extensions;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var assembly = typeof(Program).Assembly.GetName().Name;
var defaultConnectionString = configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services
    .AddIdentityServer(opt => opt.Authentication.CookieLifetime = TimeSpan.FromHours(12))
    .AddTestUsers(InMemoryConfiguration.TestUsers)
    .AddDeveloperSigningCredential()
    .AddProfileService<CustomProfileService>()
    .AddConfigurationStore(opt => opt.ConfigureDbContext = c => c.UseSqlServer(defaultConnectionString, sql => sql.MigrationsAssembly(assembly)))
    .AddOperationalStore(opt => opt.ConfigureDbContext = c => c.UseSqlServer(defaultConnectionString, sql => sql.MigrationsAssembly(assembly)));

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddControllersWithViews();

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
if (!app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Configure ConfigurationDbContext and apply any pending migrations
using (var serviceScope = app.Services.CreateScope())
{
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();

    var isMigrationPending = dbContext.Database.GetPendingMigrations().Any();

    if (isMigrationPending)
    {
        dbContext.Database.Migrate();
    }
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseIdentityServer();
app.UseAuthentication();
app.UseAuthorization();


app.UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());

app.MapRazorPages();
app.MigrateDatabase();
app.Run();
