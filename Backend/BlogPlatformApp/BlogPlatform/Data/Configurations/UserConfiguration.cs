using BlogPlatform.Enums;
using BlogPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlogPlatform.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {

            builder.HasKey(u => u.UserId);


            builder.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(100);


            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(150);


            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);


            builder.Property(u => u.Role)
                .IsRequired()
                .HasDefaultValue(Role.Subscriber);


            builder.Property(u => u.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");


            builder.Property(u => u.UpdatedAt)
                .IsRequired(false);


            builder.HasIndex(u => u.Email)
                .IsUnique();


            builder.HasMany(u => u.Posts)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.SetNull); //If the user is deleted, then the UserId in all their posts will be set to null (instead of deleting the posts).


            builder.HasMany(u => u.Comments)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade); //If the user is deleted, then all their comments are deleted too.

        }


    }
}