namespace DataAccess;

using Core.Enums;
using DataAccess.Interfaces;
using EntityContract;
using Microsoft.EntityFrameworkCore;

public class MessageRepository : RepositoryBase<Message>, IMessageRepository
{
    public MessageRepository(SocialSphereDBContext dbContext) : base(dbContext)
    { }

    public async Task AddGroup(Group group)
    {
        _dbContext.Groups.Add(group);
        await _dbContext.SaveChangesAsync();
    }

    public async Task AddMessage(Message message)
    {
        _dbContext.Messages.Add(message);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Group> GetMessageGroup(string groupName)
    {
        return await _dbContext.Groups
            .Include(x => x.Connections)
            .FirstOrDefaultAsync(x => x.Name == groupName);
    }

    public async Task<IEnumerable<Message>> GetMessageThread(string senderUserName, string recipientUserName)
    {
        var query = _dbContext.Messages
            .Where(m => (m.RecipientUsername == senderUserName && !m.IsRecipientDeleted && m.SenderUsername == recipientUserName)
                        || (m.RecipientUsername == recipientUserName && !m.IsSenderDeleted && m.SenderUsername == senderUserName))
            .OrderBy(m => m.MessageSent)
            .Include(m => m.Sender)
            .Include(m => m.Recipient)
            .AsQueryable();

        var unreadMessages = query.Where(m => m.DateRead == null && m.RecipientUsername == senderUserName)?.ToList();

        if (unreadMessages.Any())
        {
            foreach (var message in unreadMessages)
            {
                message.DateRead = DateTimeOffset.UtcNow;
            }

            await _dbContext.SaveChangesAsync();
        }

        var messages = await query.ToListAsync();

        return messages;
    }

    public async Task<Group> GetGroupForConnection(string connectionId)
    {
        return await _dbContext.Groups
            .Include(x => x.Connections)
            .Where(x => x.Connections.Any(c => c.ConnectionId == connectionId))
            .FirstOrDefaultAsync();
    }

    public async Task RemoveConnection(Connection connection)
    {
        _dbContext.Connections.Remove(connection);
        await _dbContext.SaveChangesAsync();
    }
    public async Task RemoveGroup(Group group)
    {
        _dbContext.Groups.Remove(group);
        await _dbContext.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Message> GetMessage(int id)
    {
        return await _dbContext.Messages.FindAsync(id);
    }

    public async Task DeleteMessage(Message message)
    {
        _dbContext.Messages.Remove(message);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<Message>> GetMessagesForUser(string userName, MessageType messageType)
    {
        var query = _dbContext.Messages
            .OrderByDescending(x => x.MessageSent)
            .AsQueryable();

        query = messageType switch
        {
            MessageType.Unread => query.Where(u => u.Recipient.UserName == userName && !u.IsRecipientDeleted && u.DateRead == null),
            MessageType.Inbox => query.Where(u => u.Recipient.UserName == userName && !u.IsRecipientDeleted),
            MessageType.Outbox => query.Where(u => u.Sender.UserName == userName && !u.IsSenderDeleted),
            _ => query.Where(u => u.Recipient.UserName == userName && !u.IsRecipientDeleted && u.DateRead == null)
        };

        var messages = await query.ToListAsync();

        return messages;
    }
}
