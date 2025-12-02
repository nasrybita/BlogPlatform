using BlogPlatform.Data;
using BlogPlatform.Models;
using BlogPlatform.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BlogPlatform.Repositories.Implementations
{
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDbContext _context;

        public PostRepository(ApplicationDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Post>> GetAllAsync()
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.PostCategories).ThenInclude(pc => pc.Category)
                .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
                .Include(p => p.Comments)
                .AsNoTracking()
                .ToListAsync();
        }


        public async Task<Post?> GetByIdAsync(int id)
        {
            return await _context.Posts
                .AsNoTracking()  
                .Include(p => p.User)
                .Include(p => p.PostCategories).ThenInclude(pc => pc.Category)
                .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.PostId == id);
        }
        

        public async Task<Post> AddAsync(Post post)
        {
            await _context.Posts.AddAsync(post);
            await _context.SaveChangesAsync();
            return post;
        }


        public async Task UpdateAsync(Post post)
        {
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
        }


        public async Task DeleteAsync(Post post)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }


        public async Task<bool> ExistsAsync(Expression<Func<Post, bool>> predicate)
        {
            return await _context.Posts.AnyAsync(predicate);
        }



        public async Task IncrementViewCountAsync(int id)
        {
            // Increment directly in the database
            var affectedRows = await _context.Posts
                .Where(p => p.PostId == id)
                .ExecuteUpdateAsync(p => p.SetProperty(post => post.ViewCount, post => post.ViewCount + 1));

            if (affectedRows == 0)
            {
                throw new KeyNotFoundException($"Post with ID {id} not found.");
            }


        }




        public async Task<Post?> GetByIdForUpdateAsync(int id)
        {
            // No AsNoTracking: we want a tracked entity for updates
            return await _context.Posts
                .Include(p => p.PostCategories).ThenInclude(pc => pc.Category)
                .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(p => p.PostId == id);
        }
    }


}
