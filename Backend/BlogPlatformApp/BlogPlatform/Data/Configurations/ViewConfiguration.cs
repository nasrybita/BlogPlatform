using BlogPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlogPlatform.Data.Configurations
{
    public class ViewConfiguration : IEntityTypeConfiguration<View>
    {
        public void Configure(EntityTypeBuilder<View> builder)
        {
            builder.HasKey(v => v.ViewId);


            builder.Property(v => v.ViewCount)
                .IsRequired();


            builder.HasOne(v => v.Post)
                .WithOne(p => p.View)
                .HasForeignKey<View>(v => v.PostId)
                .OnDelete(DeleteBehavior.Cascade);

        }


    }
}
