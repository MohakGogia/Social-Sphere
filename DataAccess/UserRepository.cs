using DataAccess.Interfaces;
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

        public async Task CreateUser(User user)
        {
            await Create(user);
        }
    }
}
