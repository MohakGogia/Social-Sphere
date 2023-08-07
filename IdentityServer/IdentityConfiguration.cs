namespace IdentityServer;

using System.Security.Claims;
using IdentityModel;
using IdentityServer4.Models;
using IdentityServer4.Test;

public class IdentityConfiguration
{
    public static List<TestUser> TestUsers => new()
    {
        new TestUser
        {
            SubjectId = "1",
            Username = "Admin",
            Password = "admin@401",
            Claims =
            {
            new Claim(JwtClaimTypes.Name, "Admin Singh"),
            new Claim(JwtClaimTypes.Email, "admin@testdomain.com")
            }
        },
        new TestUser
        {
            SubjectId = "2",
            Username = "Mohak",
            Password = "mohak@501",
            Claims =
            {
            new Claim(JwtClaimTypes.Name, "Mohak Gogia"),
            new Claim(JwtClaimTypes.Email, "mohak@testdomain.com"),
            }
        }
    };

    public static IEnumerable<IdentityResource> IdentityResources => new IdentityResource[]
    {
        new IdentityResources.OpenId(),
        new IdentityResources.Profile(),
    };

    public static IEnumerable<ApiScope> ApiScopes => new ApiScope[]
    {
        new ApiScope("myApi.read"),
        new ApiScope("myApi.write"),
    };

    public static IEnumerable<ApiResource> ApiResources => new ApiResource[]
    {
        new ApiResource("myApi")
        {
            Scopes = new List<string>{ "myApi.read", "myApi.write" },
            ApiSecrets = new List<Secret>{ new Secret("supersecret".Sha256()) }
        }
    };

    public static IEnumerable<Client> Clients => new Client[]
    {
        new Client
        {
            ClientId = "test client",
            ClientName = "Client Credentials client",
            AllowedGrantTypes = GrantTypes.ClientCredentials,
            ClientSecrets = { new Secret("supersecret".Sha256()) },
            AllowedScopes = { "myApi.read", "myApi.write" }
        },
    };
}
