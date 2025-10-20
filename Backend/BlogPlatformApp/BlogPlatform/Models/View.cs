using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Models
{
    public class View
    {
        [Key]
        public int ViewId { get; set; }


        [Required]
        public int PostId { get; set; }


        public long ViewCount { get; set; } = 0;


        //Navigation property
        public Post? Post { get; set; }

    }
}
