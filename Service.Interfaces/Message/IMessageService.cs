namespace Service.Interfaces.Message;

using Core.Enums;
using DataContract;

public interface IMessageService
{
    Task DeleteMessage(int id, string userName);
    Task<List<MessageDTO>> GetMessagesForUser(string userName, MessageType messageType);
}
