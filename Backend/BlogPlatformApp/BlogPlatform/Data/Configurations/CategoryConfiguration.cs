using BlogPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlogPlatform.Data.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.HasKey(c => c.CategoryId);


            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);


            builder.Property(c => c.Slug)
                .IsRequired()
                .HasMaxLength(255);


            builder.HasIndex(c => c.Slug)
                .IsUnique();


            builder.HasMany(c => c.PostCategories)
                .WithOne(pc => pc.Category)
                .HasForeignKey(pc => pc.CategoryId);

        }


    }
}
