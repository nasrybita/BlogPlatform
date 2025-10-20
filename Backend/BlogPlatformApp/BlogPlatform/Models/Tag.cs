using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Models
{
    [Index(nameof(Name), IsUnique = true)]
    [Index(nameof(Slug), IsUnique = true)]
    public class Tag
    {
        [Key]
        public int TagId { get; set; }


        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;


        [Required, MaxLength(100)]
        public string Slug { get; set; } = string.Empty;


        public ICollection<PostTag>? PostTags { get; set; }


    }
}
