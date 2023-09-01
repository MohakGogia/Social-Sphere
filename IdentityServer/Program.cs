using IdentityServer.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services
    .AddIdentityServer()
    .AddInMemoryClients(InMemoryConfiguration.Clients)
    .AddInMemoryIdentityResources(InMemoryConfiguration.IdentityResources)
    .AddInMemoryApiResources(InMemoryConfiguration.ApiResources)
    .AddInMemoryApiScopes(InMemoryConfiguration.ApiScopes)
    .AddTestUsers(InMemoryConfiguration.TestUsers)
    .AddDeveloperSigningCredential();

builder.Services.AddAuthentication("Bearer")
   .AddJwtBearer("Bearer", opt =>
   {
       opt.RequireHttpsMetadata = false;
       opt.Authority = "https://localhost:5001";
       opt.Audience = "socialSphereAPI";
   });

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseIdentityServer();
app.UseAuthentication();
app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    endpoints.MapDefaultControllerRoute();
});

app.MapRazorPages();

app.Run();
