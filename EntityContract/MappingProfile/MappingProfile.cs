using AutoMapper;
using DataContract;

namespace EntityContract
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            this.CreateMap<User, UserDTO>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedOn))
                .ForMember(dest => dest.Photos, opt => opt.MapFrom(src =>
                    src.Photos.Select(photo => new PhotoDTO
                    {
                        Id = photo.Id,
                        Url = photo.Url,
                        PublicId = photo.PublicId
                    })))
                .ForMember(dest => dest.FollowedUserIds, opt => opt.MapFrom(src => src.FollowedUsers.Select(u => u.FollowerId)))
                .ForMember(dest => dest.FollowedByUserIds, opt => opt.MapFrom(src => src.FollowedByUsers.Select(u => u.FollowingId)))
                .ReverseMap();

            this.CreateMap<Message, MessageDTO>()
                .ForMember(d => d.SenderPhotoUrl, o => o.MapFrom(s => s.Sender.ProfileImageUrl))
                .ForMember(d => d.RecipientPhotoUrl, o => o.MapFrom(s => s.Recipient.ProfileImageUrl))
                .ReverseMap();
        }
    }
}
