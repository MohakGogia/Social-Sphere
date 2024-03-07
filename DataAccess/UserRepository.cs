using DataAccess.Interfaces;
using DataContract;
using DataContract.Models;
using EntityContract;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(SocialSphereDBContext dbContext) : base(dbContext)
        { }

        public async Task<List<User>> GetAllActiveUsers(UserFilterParams filterParams)
        {
            IQueryable<User> query = _dbContext.Users.Where(x => !x.IsInactive);

            if (!string.IsNullOrWhiteSpace(filterParams.SearchQuery))
            {
                query = query.Where(x => x.UserName.Contains(filterParams.SearchQuery));
            }

            if (filterParams.OrderBy == "newestMembers")
            {
                query = query.OrderByDescending(x => x.CreatedOn);
            }
            else
            {
                query = query.OrderByDescending(x => x.LastActive);
            }

            return await query
                .Skip((filterParams.PageNumber - 1) * filterParams.PageSize)
                .Take(filterParams.PageSize)
                .ToListAsync();
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task<User> GetUserById(int userId)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId);
        }

        public async Task<User> GetUserByEmailId(string email)
        {
            return await _dbContext.Users
                .Include(u => u.Photos)
                .Include(u => u.FollowedUsers)
                .Include(u => u.FollowedByUsers)
                .Where(x => !x.IsInactive)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetUserByUserName(string userName)
        {
            return await _dbContext.Users
                    .Include(u => u.Photos)
                    .Where(x => !x.IsInactive)
                    .FirstOrDefaultAsync(u => u.UserName == userName);
        }

        public async Task<User> SaveUser(User user)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == user.Email);

            if (existingUser == null)
            {
                user.ProfileImagePublicId = "";
                user.ProfileImageUrl = "";

                await Create(user);

                return user;
            }
            else
            {
                existingUser.UserName = user.UserName;
                existingUser.DateOfBirth = user.DateOfBirth;
                existingUser.Gender = user.Gender;
                existingUser.Interests = user.Interests;
                existingUser.Bio = user.Bio;
                existingUser.City = user.City;
                existingUser.Country = user.Country;

                await Update(existingUser);

                return existingUser;
            }
        }

        public async Task SaveUserPhotos(PhotoDTO photo, int userId, bool isProfilePhoto)
        {
            var user = await _dbContext.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(x => x.Id == userId);

            if (isProfilePhoto)
            {
                user.ProfileImageUrl = photo.Url;
                user.ProfileImagePublicId = photo.PublicId;

                await Update(user);
            }
            else
            {
                var photoEntity = new Photo
                {
                    Url = photo.Url,
                    PublicId = photo.PublicId
                };

                if (user.Photos == null)
                {
                    user.Photos = new List<Photo> { photoEntity };
                }
                else
                {
                    user.Photos.Add(photoEntity);
                }

                await SaveChangesAsync();
            }
        }

        public async Task<bool> FollowUser(int userId, int followedUserId)
        {
            var user = await _dbContext.Users.Include(u => u.FollowedUsers)
                                             .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return false;
            }

            if (user.FollowedUsers.Any(uf => uf.FollowerId == followedUserId))
            {
                return false;
            }

            user.FollowedUsers.Add(new UserFollow { FollowerId = followedUserId, FollowingId = userId });

            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UnfollowUser(int userId, int unFollowedUserId)
        {
            var user = await _dbContext.Users.Include(u => u.FollowedUsers)
                                             .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return false;
            }

            var userFollow = user.FollowedUsers.FirstOrDefault(uf => uf.FollowerId == unFollowedUserId);

            if (userFollow == null)
            {
                return false;
            }

            user.FollowedUsers.Remove(userFollow);

            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<List<User>> GetFollowingUsers(int userId)
        {
            var user = await _dbContext.Users
                                .Include(u => u.FollowedUsers)
                                    .ThenInclude(u => u.Follower)
                                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return new List<User> { };
            }

            var followingUsers = user.FollowedUsers.Select(fu => fu.Follower).Where(x => !x.IsInactive).ToList();

            return followingUsers;
        }
        public async Task<List<User>> GetFollowers(int userId)
        {
            var user = await _dbContext.Users
                                .Include(u => u.FollowedByUsers)
                                    .ThenInclude(u => u.Following)
                                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return new List<User> { };
            }

            var followerUsers = user.FollowedByUsers.Select(fu => fu.Following).Where(x => !x.IsInactive).ToList();

            return followerUsers;
        }

        public async Task UpdateUsersLastActiveDate(string email)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == email);

            if (existingUser != null)
            {
                existingUser.LastActive = DateTimeOffset.UtcNow;

                await Update(existingUser);
            }
        }
    }
}
