namespace Service.Message;

using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Core.Enums;
using DataAccess.Interfaces;
using DataContract;
using EntityContract;
using Service.Interfaces.Message;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;
    private readonly IMapper _mapper;

    public MessageService(IMessageRepository messageRepository, IMapper mapper)
    {
        _messageRepository = messageRepository;
        _mapper = mapper;
    }

    public async Task DeleteMessage(int id, string userName)
    {
        var message = await _messageRepository.GetMessage(id);

        if (message == null)
        {
            return;
        }

        message.IsSenderDeleted = (message.SenderUsername == userName);

        message.IsRecipientDeleted = (message.RecipientUsername == userName);

        if (message.IsSenderDeleted && message.IsRecipientDeleted)
        {
            var msg = _mapper.Map<Message>(message);
            await _messageRepository.DeleteMessage(msg);
        }
        else
        {
            await _messageRepository.SaveChangesAsync();
        }
    }

    public async Task<List<MessageDTO>> GetMessagesForUser(string userName, MessageType messageType)
    {
        var messages = await _messageRepository.GetMessagesForUser(userName, messageType);

        return _mapper.Map<List<MessageDTO>>(messages);
    }
}
