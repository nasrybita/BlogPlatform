using BlogPlatform.DTOs.Requests;
using BlogPlatform.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostController(IPostService postService)
        {
            _postService = postService;
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
        public async Task<IActionResult> Create([FromBody] PostCreateDto dto)
        {
            var post = await _postService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = post.PostId }, post);
        }





        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PostUpdateDto dto)
        {
            var success = await _postService.UpdateAsync(id, dto);
            if (success)
            {
                return NoContent();
            }

            return NotFound();
        }





        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _postService.DeleteAsync(id);
            if (success)
            {
                return NoContent();
            }

            return NotFound();
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





    }
}
