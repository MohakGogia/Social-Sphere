using DataContract;
using DataContract.Models;
using EntityContract;

namespace DataAccess.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsers();
        Task<List<User>> GetAllActiveUsers(UserFilterParams filterParams);
        Task<User> GetUserById(int userId);
        Task<User> GetUserByEmailId(string email);
        Task<User> GetUserByUserName(string userName);
        Task<User> SaveUser(User user);
        Task SaveUserPhotos(PhotoDTO photo, int userId, bool isProfilePhoto);
        Task<bool> FollowUser(int userId, int followedUserId);
        Task<bool> UnfollowUser(int userId, int unFollowedUserId);
        Task<List<User>> GetFollowingUsers(int userId);
        Task<List<User>> GetFollowers(int userId);
        Task UpdateUsersLastActiveDate(string email);
    }
}
