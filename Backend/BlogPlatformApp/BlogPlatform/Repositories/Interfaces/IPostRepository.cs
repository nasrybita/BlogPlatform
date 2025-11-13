using BlogPlatform.Models;
using System.Linq.Expressions;

namespace BlogPlatform.Repositories.Interfaces
{
    public interface IPostRepository
    {
        Task<IEnumerable<Post>> GetAllAsync();
        Task<Post?> GetByIdAsync(int id);
        Task<Post> AddAsync(Post post);
        Task UpdateAsync(Post post);
        Task DeleteAsync(Post post);
        Task<bool> ExistsAsync(Expression<Func<Post, bool>> predicate);
        Task IncrementViewCountAsync(int id);
        Task<Post?> GetByIdForUpdateAsync(int id);
    }


}
