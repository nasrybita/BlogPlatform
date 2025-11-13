using AutoMapper;
using BlogPlatform.Data;
using BlogPlatform.DTOs.Requests;
using BlogPlatform.DTOs.Responses;
using BlogPlatform.Enums;
using BlogPlatform.Helpers;
using BlogPlatform.Models;
using BlogPlatform.Repositories.Interfaces;
using BlogPlatform.Services.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace BlogPlatform.Services.Implementations
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IValidator<PostCreateDto> _postCreateValidator;
        private readonly IValidator<PostUpdateDto> _postUpdateValidator;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public PostService(IPostRepository postRepository, IValidator<PostCreateDto> postCreateValidator, IValidator<PostUpdateDto> postUpdateValidator, IMapper mapper, ApplicationDbContext context)
        {
            _postRepository = postRepository;
            _postCreateValidator = postCreateValidator;
            _postUpdateValidator = postUpdateValidator;
            _mapper = mapper;
            _context = context;
        }



        public async Task<IEnumerable<PostResponseDto>> GetAllAsync()
        {
            var posts = await _postRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PostResponseDto>>(posts);
        }


        public async Task<PostResponseDto?> GetByIdAsync(int id)
        {

            // Increment view count
            await _postRepository.IncrementViewCountAsync(id);


            // Retrieve the post with updated view count
            var post = await _postRepository.GetByIdAsync(id);
            if (post == null)
            {
                return null;
            }


            // Map to response DTO
            return _mapper.Map<PostResponseDto>(post);

        }


        public async Task<PostResponseDto> CreateAsync(PostCreateDto dto)
        {

            // Map DTO to Post entity
            var post = _mapper.Map<Post>(dto);


            // Ensure post slug is valid
            post.Slug = SlugHelper.Slugify(post.Slug);


            //Set creation date
            post.CreatedAt = DateTime.UtcNow;


            // Temporary: anonymous post
            post.UserId = null;



            // Collect all validation errors
            var allErrors = new List<FluentValidation.Results.ValidationFailure>();


            //Run Post FluentValidation
            var validationResult = await _postCreateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                allErrors.AddRange(validationResult.Errors);
            }




            // Check for preventing duplicate slugs before saving
            var slugExists = await _postRepository.ExistsAsync(p => p.Slug == post.Slug);
            if (slugExists)
            {
                allErrors.Add(new FluentValidation.Results.ValidationFailure(
                    "Slug", $"Slug '{post.Slug}' is already in use by another post."
                    ));
            }



            // If any validation errors exist, throw one combined exception
            if (allErrors.Any())
            {
                throw new ValidationException(allErrors);
            }




            //Handle Categories
            post.PostCategories = new List<PostCategory>();
            if (dto.Categories != null)
            {
                foreach (var categoryName in dto.Categories)
                {
                    //Check if category already exists in database
                    var existingCategory = await _context.Categories
                        .FirstOrDefaultAsync(c => c.Name == categoryName);

                    if (existingCategory == null)
                    {
                        existingCategory = new Category
                        {
                            Name = categoryName,
                            Slug = SlugHelper.Slugify(categoryName)
                        };
                        await _context.Categories.AddAsync(existingCategory);
                    }

                    post.PostCategories.Add(new PostCategory { Category = existingCategory });


                }
            }



            // Handle Tags
            post.PostTags = new List<PostTag>();
            if (dto.Tags != null)
            {
                foreach (var tagName in dto.Tags)
                {
                    var existingTag = await _context.Tags
                        .FirstOrDefaultAsync(t => t.Name == tagName);

                    if (existingTag == null)
                    {
                        existingTag = new Tag
                        {
                            Name = tagName,
                            Slug = SlugHelper.Slugify(tagName)
                        };
                        await _context.Tags.AddAsync(existingTag);
                    }

                    post.PostTags.Add(new PostTag { Tag = existingTag });
                }
            }

            

            //Add post to repository
            var created = await _postRepository.AddAsync(post);


            //Map to response DTO
            var response = _mapper.Map<PostResponseDto>(created);
            return response;

        }


        public async Task<bool> UpdateAsync(int id, PostUpdateDto dto)
        {

            var existing = await _postRepository.GetByIdForUpdateAsync(id);
            if (existing == null)
            {
                return false;
            }


            _mapper.Map(dto, existing);


            // Ensure slug is URL-friendly if user changed it
            if (!string.IsNullOrEmpty(existing.Slug))
            {
                existing.Slug = SlugHelper.Slugify(existing.Slug);
            }



            // Update the "last updated" timestamp
            existing.UpdatedAt = DateTime.UtcNow;




            // Collect all validation errors
            var allErrors = new List<FluentValidation.Results.ValidationFailure>();

            // Run Post FluentValidation
            var validationResult = await _postUpdateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                allErrors.AddRange(validationResult.Errors);
            }

            // Check for preventing duplicate slugs (excluding current post)
            var slugExists = await _postRepository.ExistsAsync(p => p.Slug == existing.Slug && p.PostId != id);
            if (slugExists)
            {
                allErrors.Add(new FluentValidation.Results.ValidationFailure(
                    "Slug", $"Slug '{existing.Slug}' is already in use by another post."
                    ));
            }

            // Throw one combined exception if needed
            if (allErrors.Any())
            {
                throw new ValidationException(allErrors);
            }




            //Handle Categories after validation
            if (dto.Categories != null)
            {
                // Remove old links from database
                _context.PostCategories.RemoveRange(existing.PostCategories);

                existing.PostCategories = new List<PostCategory>();

                foreach (var categoryName in dto.Categories.Distinct(StringComparer.OrdinalIgnoreCase))
                {
                    var existingCategory = await _context.Categories
                        .FirstOrDefaultAsync(c => c.Name == categoryName);

                    if (existingCategory == null)
                    {
                        existingCategory = new Category
                        {
                            Name = categoryName,
                            Slug = SlugHelper.Slugify(categoryName)
                        };
                        await _context.Categories.AddAsync(existingCategory);
                    }

                    existing.PostCategories.Add(new PostCategory 
                    { 
                        Post = existing,
                        Category = existingCategory 
                    });
                }
            }



            //Handle Tags after validation
            if (dto.Tags != null)
            {
                // Clear old ones
                _context.PostTags.RemoveRange(existing.PostTags);

                existing.PostTags = new List<PostTag>();

                foreach (var tagName in dto.Tags.Distinct(StringComparer.OrdinalIgnoreCase))
                {
                    var existingTag = await _context.Tags
                        .FirstOrDefaultAsync(t => t.Name == tagName);

                    if (existingTag == null)
                    {
                        existingTag = new Tag
                        {
                            Name = tagName,
                            Slug = SlugHelper.Slugify(tagName)
                        };
                        await _context.Tags.AddAsync(existingTag);
                    }

                    existing.PostTags.Add(new PostTag 
                    { 
                        Post = existing,
                        Tag = existingTag 
                    });
                }
            }



            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var post = await _postRepository.GetByIdAsync(id);
            if (post == null)
            {
                return false;
            }

            await _postRepository.DeleteAsync(post);
            return true;
        }


        public async Task<bool> PublishAsync(int id)
        {
            var post = await _postRepository.GetByIdAsync(id);
            if (post == null)
            {
                return false;
            }

            // Prevent publishing twice
            if (post.Status == PostStatus.Published)
            {
                return false;
            }

            post.Status = PostStatus.Published;
            post.UpdatedAt = DateTime.UtcNow;
            await _postRepository.UpdateAsync(post);
            return true;

        }


        public async Task<bool> UnpublishAsync(int id)
        {
            var post = await _postRepository.GetByIdAsync(id);
            if (post == null)
            {
                return false;
            }

            // Prevent unpublishing twice (already a draft)
            if (post.Status == PostStatus.Draft)
            {
                return false;
            }

            post.Status = PostStatus.Draft;
            post.UpdatedAt = DateTime.UtcNow;
            await _postRepository.UpdateAsync(post);
            return true;
        }



        public async Task<bool> IncrementViewCountAsync(int postId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
            {
                return false;
            }


            post.ViewCount += 1;
            await _postRepository.UpdateAsync(post);
            return true;
        }



    }
}
