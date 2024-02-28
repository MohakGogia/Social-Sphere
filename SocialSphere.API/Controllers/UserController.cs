using System.Text.RegularExpressions;
using Core.Constants;
using DataContract;
using DataContract.Models;
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
        public async Task<IActionResult> GetAllActiveUsers([FromQuery] UserFilterParams filterParams)
        {
            return Ok(await _userService.GetAllActiveUsers(filterParams));
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

        [HttpPost("follow")]
        public async Task<IActionResult> FollowUser(int userId, int followedUserId)
        {
            var result = await _userService.FollowUser(userId, followedUserId);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("unfollow")]
        public async Task<IActionResult> UnfollowUser(int userId, int followedUserId)
        {
            var result = await _userService.UnfollowUser(userId, followedUserId);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet("following")]
        public async Task<IActionResult> GetFollowingUsers(int userId)
        {
            var followingUsers = await _userService.GetFollowingUsers(userId);

            return Ok(followingUsers);
        }

        [HttpGet("followers")]
        public async Task<IActionResult> GetFollowers(int userId)
        {
            var followers = await _userService.GetFollowers(userId);

            return Ok(followers);
        }

    }
}
