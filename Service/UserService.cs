using DataAccess.Interfaces;
using DataContract;
using EntityContract;
using Service.Interfaces;

namespace Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserDTO>> GetAllActiveUsers()
        {
            var activeUsers = await _userRepository.GetAllActiveUsers();
            var activeUsersDTO = new List<UserDTO>();

            activeUsers.ForEach(user => {
                activeUsersDTO.Add(ConvertUsertoDTOModel(user));    
            });

            return activeUsersDTO;
        }

        public async Task<List<UserDTO>> GetAllUsers()
        {
            var allUsers = await _userRepository.GetAllUsers();
            var allUsersDTO = new List<UserDTO>();

            allUsers.ForEach(user => {
                allUsersDTO.Add(ConvertUsertoDTOModel(user));
            });

            return allUsersDTO;
        }

        public async Task<UserDTO> GetUserById(int id)
        {
            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return null;
            }

            return ConvertUsertoDTOModel(user);
        }


        private static UserDTO ConvertUsertoDTOModel(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.UserName,
                Email = user.Email,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedOn,
                IsInactive = user.IsInactive,
                Gender = user.Gender,
            };
        }
    }
}
