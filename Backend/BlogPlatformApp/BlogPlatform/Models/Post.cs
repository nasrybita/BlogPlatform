using BlogPlatform.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Models
{
    [Index(nameof(Slug), IsUnique = true)]
    public class Post
    {
        [Key]
        public int PostId { get; set; }

        public int? UserId { get; set; }


        [Required, MaxLength(255)]
        public string Title { get; set; } = string.Empty;


        [Required, MaxLength(255)]
        public string Slug { get; set; } = string.Empty;


        [Required]
        public string Body { get; set; } = string.Empty;


        [Required]
        public PostStatus Status { get; set; } = PostStatus.Draft;


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public long ViewCount { get; set; } = 0;


        // Navigation properties
        public User? User { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<PostCategory> PostCategories { get; set; } = new List<PostCategory>();
        public ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
    }
}
