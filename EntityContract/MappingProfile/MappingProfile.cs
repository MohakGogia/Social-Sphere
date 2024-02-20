using AutoMapper;
using DataContract;

namespace EntityContract
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedOn))
                .ReverseMap();
        }

    }
}
