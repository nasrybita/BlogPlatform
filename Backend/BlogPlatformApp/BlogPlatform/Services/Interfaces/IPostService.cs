using BlogPlatform.DTOs.Requests;
using BlogPlatform.DTOs.Responses;
using BlogPlatform.Repositories.Interfaces;

namespace BlogPlatform.Services.Interfaces
{
    public interface IPostService
    {
        Task<IEnumerable<PostResponseDto>> GetAllAsync();
        Task<PostResponseDto?> GetByIdAsync(int id);
        Task<PostResponseDto> CreateAsync(PostCreateDto dto);
        Task<bool> UpdateAsync(int id, PostUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> PublishAsync(int id);
        Task<bool> UnpublishAsync(int id);
        Task<bool> IncrementViewCountAsync(int postId);
        Task<IEnumerable<PostResponseDto>> GetAllDraftsAsync();

    }
}
