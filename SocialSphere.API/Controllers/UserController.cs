using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;

namespace SocialSphere.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
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
        [Authorize(Roles = "Admin")]
        public IActionResult GetMockUsers(int countOfFakeUsers)
        {
            return Ok(_userService.GetMockUsers(countOfFakeUsers));
        }
    }
}
