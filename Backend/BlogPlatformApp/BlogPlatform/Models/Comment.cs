using BlogPlatform.Enums;
using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }


        [Required]
        public int PostId { get; set; } 


        public int UserId { get; set; } 


        public int? ParentCommentId { get; set; } 


        [Required]
        public string CommentBody { get; set; } = string.Empty;


        [Required]
        public CommentStatus Status { get; set; } = CommentStatus.Pending; 


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 


        // Navigation properties
        public Post? Post { get; set; }
        public User? User { get; set; }


        public Comment? ParentComment { get; set; }
        public List<Comment>? Replies { get; set; } 
    }
}
