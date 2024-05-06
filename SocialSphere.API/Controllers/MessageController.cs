namespace SocialSphere.API.Controllers;

using Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces.Message;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly IMessageService _messageService;

    public MessageController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages([FromQuery] string userName, [FromQuery] MessageType messageType)
    {
        var messages = await _messageService.GetMessagesForUser(userName, messageType);

        return Ok(messages);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteMessage([FromQuery] int id, [FromQuery] string userName)
    {
        await _messageService.DeleteMessage(id, userName);

        return Ok();
    }
}
