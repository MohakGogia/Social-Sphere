
var env = localStorage.getItem('env');

var idpSettings = {
  authority: env === 'prod' ? 'https://socialsphereidentity.azurewebsites.net' : 'https://localhost:5001',
  clientId: "angular-client",
  scope: "openid profile socialSphereAPI roles",
  response_type: "code"
};

new Oidc.UserManager(idpSettings).signinSilentCallback()
  .catch(function(error) {
    console.log(error);
});
