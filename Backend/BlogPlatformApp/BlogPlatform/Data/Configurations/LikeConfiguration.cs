using BlogPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlogPlatform.Data.Configurations
{
    public class LikeConfiguration : IEntityTypeConfiguration<Like>
    {
        public void Configure(EntityTypeBuilder<Like> builder)
        {
            builder.HasKey(l => l.LikeId);


            builder.Property(l => l.PostId)
                .IsRequired();


            builder.Property(l => l.UserId)
                .IsRequired();


            builder.Property(l => l.LikedAt)
                .HasDefaultValueSql("GETUTCDATE()") 
                .IsRequired();


            builder.HasIndex(l => new { l.PostId, l.UserId })
                .IsUnique();


            builder.HasOne(l => l.Post)
                .WithMany()
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade); //if a Post is deleted, all Likes related to that Post are also deleted automatically.


            builder.HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade); //if a User is deleted, all their Likes are deleted automatically.
        }


    }
}
