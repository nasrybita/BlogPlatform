using BlogPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlogPlatform.Data.Configurations
{
    public class PostConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {

            builder.HasKey(p => p.PostId);


            builder.Property(p => p.Title)
                .IsRequired()
                .HasMaxLength(255);


            builder.Property(p => p.Slug)
                .IsRequired()
                .HasMaxLength(255);


            builder.Property(p => p.Body)
                .IsRequired();


            builder.Property(p => p.Status)
                .IsRequired();


            builder.HasIndex(p => p.Slug)
                .IsUnique();


            builder.HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.SetNull);


            builder.HasOne(p => p.View)
                .WithOne(v => v.Post)
                .HasForeignKey<View>(v => v.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
