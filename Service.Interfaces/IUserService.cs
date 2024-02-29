using DataContract;
using DataContract.Models;

namespace Service.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsers();
        Task<List<UserDTO>> GetAllActiveUsers(UserFilterParams filterParams);
        Task<UserDTO> GetUserById(int id);
        Task<UserDTO> GetUserByEmailId(string email);
        Task<UserDTO> GetUserByUserName(string userName);
        List<UserDTO> GetMockUsers(int countOfFakeUsers);
        Task<UserDTO> SaveUser(UserDTO user);
        Task SaveUserPhotos(PhotoDTO photo, int userId, bool isProfilePhoto);
        Task DeleteUserPhoto(int photoId);
        Task<bool> FollowUser(int userId, int followedUserId);
        Task<bool> UnfollowUser(int userId, int unFollowedUserId);
        Task<List<UserDTO>> GetFollowingUsers(int userId);
        Task<List<UserDTO>> GetFollowers(int userId);
    }
}
