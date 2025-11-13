using BlogPlatform.Enums;
using BlogPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlogPlatform.Data.Configurations
{
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.HasKey(c => c.CommentId);


            builder.Property(c => c.PostId)
                .IsRequired();


            builder.Property(c => c.UserId)
                .IsRequired();


            builder.Property(c => c.ParentCommentId)
                .IsRequired(false);


            builder.Property(c => c.CommentBody)
                .IsRequired();


            builder.Property(c => c.Status)
                .IsRequired()
                .HasDefaultValue(CommentStatus.Pending);


            builder.Property(c => c.CreatedAt)
               .HasDefaultValueSql("GETUTCDATE()")
               .IsRequired();


            builder.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade); //if a Post is deleted, all related Comments are automatically deleted from the database.


            builder.HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict); //prevents deleting a User if they still have Comments.


            builder.HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.ClientCascade); //if a parent comment is deleted, its replies are deleted too.
        }


    }
}
