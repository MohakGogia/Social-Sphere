using IdentityServer.Configuration;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;

public class CustomProfileService : IProfileService
{
    public Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var sub = context.Subject.GetSubjectId();
        var user = InMemoryConfiguration.TestUsers
            .Find(u => u.SubjectId.Equals(sub, StringComparison.Ordinal));

        context.IssuedClaims.AddRange(user.Claims);
        return Task.CompletedTask;
    }

    public Task IsActiveAsync(IsActiveContext context)
    {
        var sub = context.Subject.GetSubjectId();
        var user = InMemoryConfiguration.TestUsers
            .Find(u => u.SubjectId.Equals(sub, StringComparison.Ordinal));

        context.IsActive = user != null;
        return Task.CompletedTask;
    }
}
