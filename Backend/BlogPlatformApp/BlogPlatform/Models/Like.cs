using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Models
{
    [Index(nameof(PostId), nameof(UserId), IsUnique = true)]
    public class Like
    {
        [Key]
        public int LikeId { get; set; }

        [Required]
        public int PostId { get; set; } 

        [Required]
        public int UserId { get; set; } 

        public DateTime LikedAt { get; set; } = DateTime.UtcNow;


        // Navigation properties
        public Post? Post { get; set; }
        public User? User { get; set; }
    }
}
