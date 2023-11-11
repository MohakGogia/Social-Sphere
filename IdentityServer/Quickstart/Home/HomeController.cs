// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IdentityServerHost.Quickstart.UI
{
    [SecurityHeaders]
    [AllowAnonymous]
    public class HomeController : Controller
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly string redirectUrl;

        public HomeController(IIdentityServerInteractionService interaction, IConfiguration config)
        {
            _interaction = interaction;
            redirectUrl = GetRedirectionURL(config);
        }

        public IActionResult Index()
        {
            return Redirect(redirectUrl);
        }

        /// <summary>
        /// Shows the error page
        /// </summary>
        public async Task<IActionResult> Error(string errorId)
        {
            var vm = new ErrorViewModel();

            // retrieve error details from identityserver
            var message = await _interaction.GetErrorContextAsync(errorId);

            if (message != null)
            {
                vm.Error = message;
            }

            return View("Error", vm);
        }

        private static string GetRedirectionURL(IConfiguration config)
        {
            var clientAddres = config.GetSection("ClientAddress").Get<string>();

            if (string.IsNullOrWhiteSpace(clientAddres))
            {
                throw new ArgumentNullException(nameof(clientAddres), "Result cannot be null or whitespace.");
            }

            return clientAddres;
        }
    }
}
