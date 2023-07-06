﻿using EntityContract;

namespace DataAccess.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsers();
        Task<List<User>> GetAllActiveUsers();
        Task<User> GetUserById(int userId);
    }
}