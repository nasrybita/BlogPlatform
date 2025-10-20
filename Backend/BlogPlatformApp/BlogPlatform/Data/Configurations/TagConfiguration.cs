using BlogPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlogPlatform.Data.Configurations
{
    public class TagConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {

            builder.HasKey(t => t.TagId);


            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(50);


            builder.Property(t => t.Slug)
                .IsRequired()
                .HasMaxLength(100);


            builder.HasIndex(t => t.Name)
                .IsUnique();


            builder.HasIndex(t => t.Slug)
                .IsUnique();

        }


    }
}
