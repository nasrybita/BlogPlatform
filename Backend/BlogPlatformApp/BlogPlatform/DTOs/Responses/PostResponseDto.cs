using BlogPlatform.Enums;

namespace BlogPlatform.DTOs.Responses
{
    public class PostResponseDto
    {
        public int PostId { get; set; }
        public int? UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public PostStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public IEnumerable<string> Categories { get; set; } = Array.Empty<string>();
        public IEnumerable<string> Tags { get; set; } = Array.Empty<string>();
        public long ViewCount { get; set; }
    }
}
