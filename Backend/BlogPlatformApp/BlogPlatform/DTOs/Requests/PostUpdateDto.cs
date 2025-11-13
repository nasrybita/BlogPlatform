using BlogPlatform.Enums;

namespace BlogPlatform.DTOs.Requests
{
    public class PostUpdateDto
    {
        public string? Title { get; set; }
        public string? Slug { get; set; }
        public string? Body { get; set; }
        public PostStatus? Status { get; set; }
        public IEnumerable<string>? Categories { get; set; }
        public IEnumerable<string>? Tags { get; set; }
    }
}
