namespace SocialSphere.API.Controllers;

using DataContract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using Service.Interfaces.ImageAttachments;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ImageController : ControllerBase
{
    private readonly IPhotoService _photoService;
    private readonly IUserService _userService;

    public ImageController(IPhotoService photoService, IUserService userService)
    {
        _photoService = photoService;
        _userService = userService;
    }

    [HttpPost("add-photo")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> AddPhoto(int userId, bool isProfilePhoto)
    {
        var file = Request?.Form?.Files[0];
        if (file == null)
        {
            return BadRequest();
        }

        var result = await _photoService.AddPhoto(file);

        if (result.Error != null)
        {
            return BadRequest();
        }

        var photo = new PhotoDTO
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        await _userService.SaveUserPhotos(photo, userId, isProfilePhoto);

        return Ok(photo);
    }

    [HttpDelete("delete-photo")]
    public async Task<IActionResult> DeletePhoto([FromQuery] string photoPublicId)
    {
        var result = await _photoService.DeletePhoto(photoPublicId);

        if (result.Error != null)
        {
            return BadRequest();
        }

        return Ok();
    }
}
