using DataContract;

namespace Service.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsers();
        Task<List<UserDTO>> GetAllActiveUsers();
        Task<UserDTO> GetUserById(int id);
    }
}
