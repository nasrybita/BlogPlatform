using BlogPlatform.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlogPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DraftPostController : ControllerBase
    {
        private readonly IPostService _postService;
        public DraftPostController(IPostService postService)
        {
            _postService = postService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllDrafts()
        {
            var draftPosts = await _postService.GetAllDraftsAsync();
            return Ok(draftPosts);
        }
    }
}
