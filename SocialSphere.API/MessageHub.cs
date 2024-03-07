namespace SocialSphere.API;

using AutoMapper;
using DataAccess.Interfaces;
using DataContract;
using EntityContract;
using Microsoft.AspNetCore.SignalR;

public class MessageHub : Hub
{
    private readonly IMapper _mapper;
    private readonly IHubContext<PresenceHub> _presenceHub;
    private readonly IMessageRepository _messageRepository;
    private readonly IUserRepository _userRepository;

    public MessageHub(IMapper mapper, IHubContext<PresenceHub> presenceHub, IMessageRepository messageRepository, IUserRepository userRepository)
    {
        _mapper = mapper;
        _presenceHub = presenceHub;
        _messageRepository = messageRepository;
        _userRepository = userRepository;

    }
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var sender = httpContext.Request.Query["sender"];
        var receiver = httpContext.Request.Query["receiver"];
        var groupName = GetGroupName(sender, receiver);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        var group = await AddToGroup(groupName, sender);

        await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

        var messages = await _messageRepository.GetMessageThread(sender, receiver);

        await Clients.Caller.SendAsync("ReceiveMessageThread", _mapper.Map<List<MessageDTO>>(messages));
    }

    public override async Task OnDisconnectedAsync(Exception ex)
    {
        var group = await RemoveFromMessageGroup();
        await Clients.Group(group.Name).SendAsync("UpdatedGroup");
        await base.OnDisconnectedAsync(ex);
    }

    public async Task SendMessage(CreateMessageDTO createMessageDTO)
    {
        if (createMessageDTO.SenderUsername.ToLower() == createMessageDTO.RecipientUsername.ToLower())
        {
            throw new HubException("You cannot send messages to yourself");
        }

        var sender = await _userRepository.GetUserByUserName(createMessageDTO.SenderUsername);
        var recipient = await _userRepository.GetUserByUserName(createMessageDTO.RecipientUsername) ?? throw new HubException("User not found");

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDTO.Content
        };

        var groupName = GetGroupName(sender.UserName, recipient.UserName);

        var group = await _messageRepository.GetMessageGroup(groupName);

        if (group.Connections.Any(x => x.UserName == recipient.UserName))
        {
            message.DateRead = DateTimeOffset.UtcNow;
        }
        else
        {
            var connections = await PresenceTracker.GetConnectionsForUser(recipient.UserName);

            if (connections != null)
            {
                await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", sender.UserName);
            }
        }

        await _messageRepository.AddMessage(message);

        await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDTO>(message));
    }

    private static string GetGroupName(string sender, string reciever)
    {
        var stringCompare = string.CompareOrdinal(sender, reciever) < 0;
        return stringCompare ? $"{sender}-{reciever}-Connection-Group" : $"{reciever}-{sender}-Connection-Group";
    }

    private async Task<Group> AddToGroup(string groupName, string sender)
    {
        try
        {
            var group = await _messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, sender);

            if (group == null)
            {
                group = new Group(groupName);
                await _messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);
            await _messageRepository.SaveChangesAsync();

            return group;
        }
        catch(Exception)
        {
            throw new HubException("Failed to add to group");
        }

    }

    private async Task<Group> RemoveFromMessageGroup()
    {
        try
        {
            var group = await _messageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group?.Connections?.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

            await _messageRepository.RemoveConnection(connection);

            if (!group.Connections.Any())
            {
                //TODO: Why giving error
                await _messageRepository.RemoveGroup(group);
            }

            return group;
        }
        catch (Exception)
        {
            throw new HubException("Failed to remove from group");
        }
    }
}


public class CreateMessageDTO
{
    public string SenderUsername { get; set; }
    public string RecipientUsername { get; set; }
    public string Content { get; set; }
}
