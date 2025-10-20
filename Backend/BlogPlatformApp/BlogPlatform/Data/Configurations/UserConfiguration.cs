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


            builder.HasIndex(u => u.Email)
                .IsUnique();


            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);


            builder.Property(u => u.Role)
                .IsRequired();


            builder.HasMany(u => u.Posts)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.SetNull);


        }
    }
}