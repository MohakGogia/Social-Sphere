namespace IdentityServer.Quickstart.Account;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

public class RegisterViewModel
{
    [DisplayName("Username")]
    public string UserName { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    public string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    [DisplayName("Confirm password")]
    public string ConfirmPassword { get; set; }
}
