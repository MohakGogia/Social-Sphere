using AutoMapper;
using Bogus;
using DataAccess.Interfaces;
using DataContract;
using Service.Interfaces;

namespace Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<List<UserDTO>> GetAllActiveUsers()
        {
            var activeUsers = await _userRepository.GetAllActiveUsers();
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

        public List<UserDTO> GetMockUsers(int countOfFakeUsers)
        {
            var faker = new Faker<UserDTO>(locale: "en_IND")
                        .RuleFor(u => u.Id, f => f.Random.Number(1, 100))
                        .RuleFor(u => u.Name, f => f.Person.FullName)
                        .RuleFor(u => u.Email, f => f.Person.Email)
                        .RuleFor(u => u.DateOfBirth, f => f.Person.DateOfBirth)
                        .RuleFor(u => u.Gender, f => f.PickRandom('M', 'F'))
                        .RuleFor(u => u.IsInactive, f => f.Random.Bool())
                        .RuleFor(u => u.CreatedAt, f => f.Date.PastOffset());

            return faker.Generate(countOfFakeUsers);
        }
    }
}
