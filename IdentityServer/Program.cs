using System.IdentityModel.Tokens.Jwt;
using IdentityServer;
using IdentityServer.Extensions;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

var seed = args.Contains("/seed");
if (seed)
{
    args = args.Except(new[] { "/seed" }).ToArray();
}

var builder = WebApplication.CreateBuilder(args);

var env_Name = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

builder.Configuration.SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env_Name ?? "Production"}.json", optional: true)
          .AddEnvironmentVariables()
          .Build();

var configuration = builder.Configuration;

var assembly = typeof(Program).Assembly.GetName().Name;
var defaultConnectionString = configuration.GetConnectionString("DefaultConnection");


if (seed)
{
    SeedData.EnsureSeedData(defaultConnectionString, configuration);
}

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlServer(defaultConnectionString, opt =>
        {
            opt.MigrationsAssembly(assembly);
            opt.CommandTimeout(120);
        }));

builder.Services.AddIdentity<IdentityUser, IdentityRole>(opt =>
{
    opt.Password.RequiredLength = 6;
    opt.Password.RequireDigit = true;
    opt.Password.RequireUppercase = true;
}).AddEntityFrameworkStores<ApplicationDBContext>();

builder.Services
    .AddIdentityServer(opt => opt.Authentication.CookieLifetime = TimeSpan.FromHours(12))
    .AddProfileService<CustomProfileService>()
    .AddConfigurationStore(opt => opt.ConfigureDbContext = c => c.UseSqlServer(defaultConnectionString, sql => sql.MigrationsAssembly(assembly)))
    .AddOperationalStore(opt => opt.ConfigureDbContext = c => c.UseSqlServer(defaultConnectionString, sql => sql.MigrationsAssembly(assembly)))
    .AddDeveloperSigningCredential();


builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", policy =>
    {
        var clientAddress = configuration.GetSection("ClientAddress").Get<string>();
        policy.WithOrigins(new string[] { clientAddress })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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

app.UseCors("MyPolicy");
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
