using BlogPlatform.DTOs.Requests;
using BlogPlatform.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace BlogPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly IWebHostEnvironment _env;

        public PostController(IPostService postService, IWebHostEnvironment env)
        {
            _postService = postService;
            _env = env;
        }



        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _postService.GetAllAsync();
            return Ok(posts);
        }





        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _postService.GetByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            return Ok(post);

        }





        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] PostCreateDto dto, IFormFile? featuredImage)
        {

            string? imageUrl = null;

            try
            {
                imageUrl = await SaveFeaturedImageAsync(featuredImage);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            var post = await _postService.CreateAsync(dto, imageUrl);
            return CreatedAtAction(nameof(GetById), new { id = post.PostId }, post);
        }





        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] PostUpdateDto dto, IFormFile? featuredImage)
        {
            // Get existing post
            var post = await _postService.GetByIdAsync(id);
            if (post == null)
                return NotFound(new { message = "Post not found" });

            string? imageUrl = post.FeaturedImageUrl;

            // -------------------- Handle Featured Image Removal --------------------
            if (dto.RemoveFeaturedImage)
            {
                if (!string.IsNullOrEmpty(post.FeaturedImageUrl))
                {
                    var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    var imagePath = Path.Combine(webRootPath, post.FeaturedImageUrl.TrimStart('/').Replace("/", "\\"));

                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath); // Delete the file physically
                    }

                    imageUrl = null; // Clear the database field
                }
            }

            // -------------------- Handle New Featured Image --------------------
            if (featuredImage != null)
            {
                try
                {
                    imageUrl = await SaveFeaturedImageAsync(featuredImage);
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }

                // If there was a previous image, delete it
                if (!string.IsNullOrEmpty(post.FeaturedImageUrl))
                {
                    var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    var oldImagePath = Path.Combine(webRootPath, post.FeaturedImageUrl.TrimStart('/').Replace("/", "\\"));

                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }
            }

            // -------------------- Update Post --------------------
            var success = await _postService.UpdateAsync(id, dto, imageUrl);
            if (success)
            {
                return Ok(new { message = "Post updated successfully" });
            }

            return NotFound(new { message = "Post not found" });

        }





        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _postService.DeleteAsync(id);
            if (success)
            {
                return Ok(new { message = "Post deleted successfully" });
            }

            return NotFound(new { message = "Post not found" });
        }





        [HttpPut("{id}/publish")]
        public async Task<IActionResult> Publish(int id)
        {
            var success = await _postService.PublishAsync(id);
            if (!success)
            {
                return BadRequest("Cannot publish this post (it may not exist or is already published).");
            }

            return NoContent();
        }





        [HttpPut("{id}/unpublish")]
        public async Task<IActionResult> Unpublish(int id)
        {
            var success = await _postService.UnpublishAsync(id);
            if (!success)
            {
                return BadRequest("Cannot unpublish this post (it may not exist or is already a draft).");
            }

            return NoContent();
        }



        private async Task<string?> SaveFeaturedImageAsync(IFormFile? featuredImage)
        {
            if (featuredImage == null || featuredImage.Length == 0)
            {
                return null;
            }

            // Only allow JPEG / JPG
            if (!string.Equals(featuredImage.ContentType, "image/jpeg", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(featuredImage.ContentType, "image/jpg", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Only JPEG/JPG images are allowed.");
            }

            var extension = Path.GetExtension(featuredImage.FileName).ToLowerInvariant();
            if (extension != ".jpg" && extension != ".jpeg")
            {
                throw new InvalidOperationException("Only JPEG/JPG images are allowed.");
            }

            // Ensure wwwroot/images exists
            var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var imagesFolder = Path.Combine(webRootPath, "images");
            Directory.CreateDirectory(imagesFolder);

            // Generate unique file name
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(imagesFolder, fileName);

            using (var stream = System.IO.File.Create(filePath))
            {
                await featuredImage.CopyToAsync(stream);
            }

            // Return relative URL (will be used by frontend)
            return $"/images/{fileName}";
        }






    }
}
