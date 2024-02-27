using AutoMapper;
using Bogus;
using DataAccess.Interfaces;
using DataContract;
using DataContract.Models;
using EntityContract;
using Service.Interfaces;

namespace Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IRepositoryBase<Photo> _photoRepository;

        public UserService(IUserRepository userRepository, IMapper mapper, IRepositoryBase<Photo> photoRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoRepository = photoRepository;
        }

        public async Task<List<UserDTO>> GetAllActiveUsers(UserFilterParams filterParams)
        {
            var activeUsers = await _userRepository.GetAllActiveUsers(filterParams);
            return _mapper.Map<List<UserDTO>>(activeUsers);
        }

        public async Task<List<UserDTO>> GetAllUsers()
        {
            var allUsers = await _userRepository.GetAllUsers();

            return _mapper.Map<List<UserDTO>>(allUsers);
        }

        public async Task<UserDTO> GetUserById(int id)
        {
            var user = await _userRepository.GetUserById(id);

            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> GetUserByEmailId(string email)
        {
            var user = _mapper.Map<UserDTO>(await _userRepository.GetUserByEmailId(email));

            return user;
        }

        public List<UserDTO> GetMockUsers(int countOfFakeUsers)
        {
            var faker = new Faker<UserDTO>(locale: "en_IND")
                        .RuleFor(u => u.Id, f => f.Random.Number(1, 100))
                        .RuleFor(u => u.UserName, f => f.Person.FullName)
                        .RuleFor(u => u.Email, f => f.Person.Email)
                        .RuleFor(u => u.DateOfBirth, f => f.Person.DateOfBirth)
                        .RuleFor(u => u.Gender, f => f.PickRandom("Male", "Female", "Other"))
                        .RuleFor(u => u.IsInactive, f => f.Random.Bool())
                        .RuleFor(u => u.CreatedAt, f => f.Date.PastOffset());

            return faker.Generate(countOfFakeUsers);
        }

        public async Task<UserDTO> SaveUser(UserDTO user)
        {
            var newUser = _mapper.Map<User>(user);

            return _mapper.Map<UserDTO>(await _userRepository.SaveUser(newUser));
        }

        public async Task SaveUserPhotos(PhotoDTO photo, int userId, bool isProfilePhoto)
        {
            await _userRepository.SaveUserPhotos(photo, userId, isProfilePhoto);
        }

        public async Task DeleteUserPhoto(int photoId)
        {
            await _photoRepository.Delete(photoId);
        }

    }
}
