using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using BlogPlatform.Enums;

namespace BlogPlatform.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        [Key]
        public int UserId { get; set; }


        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;


        [Required, MaxLength(150), EmailAddress]
        public string Email { get; set; } = string.Empty;


        [Required, MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;


        [Required]
        public Role Role { get; set; } = Role.Subscriber;


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }


        // Navigation properties
        public ICollection<Post>? Posts { get; set; }
        public ICollection<Comment>? Comments { get; set; }

    }
}
