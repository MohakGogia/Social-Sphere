using DataContract;

namespace Service.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsers();
        Task<List<UserDTO>> GetAllActiveUsers();
        Task<UserDTO> GetUserById(int id);
        Task<UserDTO> GetUserByEmailId(string email);
        List<UserDTO> GetMockUsers(int countOfFakeUsers);
        Task<UserDTO> SaveUser(UserDTO user);
        Task SaveUserPhotos(PhotoDTO photo, int userId, bool isProfilePhoto);
        Task DeleteUserPhoto(int photoId);
    }
}
