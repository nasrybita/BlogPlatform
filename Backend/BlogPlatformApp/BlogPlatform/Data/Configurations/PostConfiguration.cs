using BlogPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Hosting;
using System.Xml.Linq;

namespace BlogPlatform.Data.Configurations
{
    public class PostConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {

            builder.HasKey(p => p.PostId);



            builder.Property(p => p.UserId)
                .IsRequired(false);



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



            builder.Property(p => p.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");



            builder.Property(p => p.UpdatedAt)
                .IsRequired(false);



            builder.Property(p => p.ViewCount)
                .HasDefaultValue(0)
                .IsRequired();



            builder.HasIndex(p => p.Slug)
                .IsUnique();



            builder.HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.SetNull); //If the user is deleted, the UserId in the post becomes null instead of deleting the post.



            builder.HasMany(p => p.Comments)
                .WithOne(c => c.Post)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade); //If the post is deleted, all its comments are automatically deleted too.



            builder.HasMany(p => p.PostCategories)
                .WithOne(pc => pc.Post)
                .HasForeignKey(pc => pc.PostId);



            builder.HasMany(p => p.PostTags)
                .WithOne(pt => pt.Post)
                .HasForeignKey(pt => pt.PostId);

        }



    }
}
