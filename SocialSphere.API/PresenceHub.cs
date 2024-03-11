namespace SocialSphere.API;

using Microsoft.AspNetCore.SignalR;

public class PresenceHub : Hub
{
    private readonly PresenceTracker _tracker;
    public PresenceHub(PresenceTracker tracker)
    {
        _tracker = tracker;
    }

    public override async Task OnConnectedAsync()
    {
        var userName = Context.GetHttpContext().Request.Query["userName"];

        var isOnline = await _tracker.UserConnected(userName, Context.ConnectionId);

        if (isOnline)
        {
            await Clients.Others.SendAsync("UserIsOnline", userName.ToString());
        }

        var currentUsers = await _tracker.GetOnlineUsers();

        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception ex)
    {
        var userName = Context.GetHttpContext().Request.Query["userName"];

        var isOffline = await _tracker.UserDisconnected(userName, Context.ConnectionId);

        if (isOffline)
        {
            await Clients.Others.SendAsync("UserIsOffline", userName.ToString());
        }

        await base.OnDisconnectedAsync(ex);
    }
}
