using Microsoft.AspNetCore.Mvc;

namespace SocialSphere.API.Controllers
{
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userSesrvice;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await _userService.GetAllUsers());
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetAllActiveUsers()
        {
            return Ok(await _userService.GetAllActiveUsers());
        }

        [HttpGet("getUserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("getMockUsers")]
        public IActionResult GetMockUsers(int countOfFakeUsers)
        {
            return Ok(_userService.GetMockUsers(countOfFakeUsers));
        }
    }
}