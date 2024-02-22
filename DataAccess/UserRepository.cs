using DataAccess.Interfaces;
using DataContract;
using EntityContract;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(SocialSphereDBContext dbContext) : base(dbContext)
        { }

        public async Task<List<User>> GetAllActiveUsers()
        {
            return await _dbContext.Users.Where(x => !x.IsInactive).ToListAsync();
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
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> SaveUser(User user)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == user.Email);

            if (existingUser == null)
            {
                user.LastActive = DateTimeOffset.UtcNow;
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
                existingUser.LastActive = DateTimeOffset.UtcNow;

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
    }
}
