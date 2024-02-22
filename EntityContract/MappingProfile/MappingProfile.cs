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
                .ForMember(dest => dest.Photos, opt => opt.MapFrom(src =>
                    src.Photos.Select(photo => new PhotoDTO
                    {
                        Id = photo.Id,
                        Url = photo.Url,
                        PublicId = photo.PublicId
                    })))
                .ReverseMap();
        }

    }
}
