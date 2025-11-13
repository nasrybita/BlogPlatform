using AutoMapper;
using BlogPlatform.DTOs.Requests;
using BlogPlatform.DTOs.Responses;
using BlogPlatform.Models;


namespace BlogPlatform.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Post mappings
            CreateMap<Post, PostResponseDto>()
                .ForMember(dest => dest.Categories, 
                    opt => opt.MapFrom(src => src.PostCategories != null
                        ? src.PostCategories.Select(pc => pc.Category != null ? pc.Category.Name : string.Empty )
                        : Enumerable.Empty<string>()))
                .ForMember(dest => dest.Tags,
                    opt => opt.MapFrom(src => src.PostTags != null
                        ? src.PostTags.Select(pt => pt.Tag != null ? pt.Tag.Name : string.Empty)
                        : Enumerable.Empty<string>()))
                .ForMember(dest => dest.ViewCount,
                        opt => opt.MapFrom(src => src.ViewCount));



            CreateMap<PostCreateDto, Post>();



            CreateMap<PostUpdateDto, Post>()
                // This line ensures that AutoMapper only updates properties that have actual values
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        }
    }
}
