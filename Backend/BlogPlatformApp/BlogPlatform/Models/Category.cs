using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace BlogPlatform.Models
{
    [Index(nameof(Slug), IsUnique = true)]
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }


        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;


        [Required, MaxLength(255)]
        public string Slug { get; set; } = string.Empty;


        public ICollection<PostCategory>? PostCategories { get; set; }


    }
}
