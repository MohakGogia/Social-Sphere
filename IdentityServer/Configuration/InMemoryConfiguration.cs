namespace IdentityServer.Configuration;

using System.Security.Claims;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;

public class InMemoryConfiguration
{
    public static List<TestUser> TestUsers => new()
    {
        new TestUser
        {
            SubjectId = "a9ea0f25-b964-409f-bcce-c923266249b4",
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
            SubjectId = "a9ea0f25-b964-409f-bcce-c923266249b5",
            Username = "Mohak",
            Password = "mohak@501",
            Claims =
            {
                new Claim(JwtClaimTypes.Name, "Mohak Gogia"),
                new Claim(JwtClaimTypes.Email, "mohak@testdomain.com")
            }
        },
        new TestUser
        {
            SubjectId = "a9ea0f25-b964-409f-bcce-c923266249b6",
            Username = "Test user",
            Password = "123456",
            Claims =
            {
                new Claim(JwtClaimTypes.Name, "Test User"),
                new Claim(JwtClaimTypes.Email, "testinguser@testdomain.com")
            }
        }
    };

    public static IEnumerable<IdentityResource> IdentityResources => new IdentityResource[]
    {
        new IdentityResources.OpenId(),
        new IdentityResources.Profile()
    };

    public static IEnumerable<ApiScope> ApiScopes => new List<ApiScope>
    {
        new ApiScope("socialSphereAPI", "Social Sphere API")
    };

    public static IEnumerable<ApiResource> ApiResources => new ApiResource[]
    {
        new ApiResource("socialSphereAPI", "Social Sphere API")
        {
            Scopes = { "socialSphereAPI" }
        }
    };

    public static IEnumerable<Client> Clients => new List<Client>
    {
        new Client
        {
            ClientId = "test-client",
            ClientName = "Client Credentials Client",
            AllowedGrantTypes = GrantTypes.ClientCredentials,
            ClientSecrets = { new Secret("supersecret".Sha256()) },
            AllowedScopes = { IdentityServerConstants.StandardScopes.OpenId, "socialSphereAPI" }
        },
        new Client
        {
            ClientId = "admin",
            ClientName = "Resource Owner Password and Client Credentials Client",
            AllowedGrantTypes = GrantTypes.ResourceOwnerPasswordAndClientCredentials,
            ClientSecrets = { new Secret("supersecret".Sha256()) },
            AllowedScopes = { IdentityServerConstants.StandardScopes.OpenId, "socialSphereAPI" }
        }
    };
}
