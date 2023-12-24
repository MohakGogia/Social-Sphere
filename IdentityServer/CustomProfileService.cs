using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;

public class CustomProfileService : IProfileService
{
    private readonly UserManager<IdentityUser> _userManager;

    public CustomProfileService(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var userId = context.Subject.Identity.GetSubjectId();
        var user = await _userManager.FindByIdAsync(userId);

        if (user != null)
        {
            var claims = await _userManager.GetClaimsAsync(user);

            context.IssuedClaims.AddRange(claims);
        }
    }

    public async Task IsActiveAsync(IsActiveContext context)
    {
        var userId = context.Subject.Identity.GetSubjectId();
        var user = await _userManager.FindByIdAsync(userId);

        context.IsActive = user != null;
    }
}
