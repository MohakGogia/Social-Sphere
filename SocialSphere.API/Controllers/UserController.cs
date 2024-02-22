using System.Text.RegularExpressions;
using Core.Constants;
using DataContract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using static SocialSphere.API.Authorization.Constants;

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("email/{emailId}")]
        public async Task<IActionResult> GetUserByEmailId(string emailId)
        {
            if (string.IsNullOrEmpty(emailId) || !Regex.IsMatch(emailId, AppConstants.EmailRegex))
            {
                return BadRequest();
            }

            var user = await _userService.GetUserByEmailId(emailId);

            return Ok(user);
        }

        [HttpGet("mock-users")]
        [Authorize(Roles = PolicyNames.Admin)]
        public IActionResult GetMockUsers(int countOfFakeUsers)
        {
            return Ok(_userService.GetMockUsers(countOfFakeUsers));
        }

        [HttpPost]
        public async Task<IActionResult> SaveUser([FromBody] UserDTO user)
        {
            return Ok(await _userService.SaveUser(user));
        }
    }
}
