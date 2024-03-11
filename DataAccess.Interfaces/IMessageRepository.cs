namespace DataAccess.Interfaces;

using EntityContract;

public interface IMessageRepository
{
    Task AddMessage(Message message);
    Task AddGroup(Group group);
    Task RemoveConnection(Connection connection);
    Task RemoveGroup(Group group);
    Task<Group> GetMessageGroup(string groupName);
    Task<IEnumerable<Message>> GetMessageThread(string senderUserName, string recipientUserName);
    Task<Group> GetGroupForConnection(string connectionId);
    Task SaveChangesAsync();
}
