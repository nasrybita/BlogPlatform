using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class PostCategoryValidator : AbstractValidator<PostCategory>
    {
        public PostCategoryValidator()
        {

            RuleFor(pc => pc.PostId)
                .GreaterThan(0).WithMessage("PostId must be provided.");


            RuleFor(pc => pc.CategoryId)
                .GreaterThan(0).WithMessage("CategoryId must be provided.");


        }
    }
}
