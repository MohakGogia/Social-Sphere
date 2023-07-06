using Microsoft.AspNetCore.SignalR;

namespace SocialSphere.API
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("Connected", "System", $"{Context.ConnectionId} has joined the chat.");
            await base.OnConnectedAsync();
        }
    }
}
