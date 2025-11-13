namespace BlogPlatform.DTOs.Requests
{
    public class PostCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Body {  get; set; } = string.Empty;
        public IEnumerable<string>? Categories { get; set; } = Array.Empty<string>();
        public IEnumerable<string>? Tags { get; set; } = Array.Empty<string>();

    }
}
