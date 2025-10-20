using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class PostTagValidator : AbstractValidator<PostTag>
    {
        public PostTagValidator()
        {

            RuleFor(pt => pt.PostId)
                .GreaterThan(0).WithMessage("PostId must be provided.");


            RuleFor(pt => pt.TagId)
                .GreaterThan(0).WithMessage("TagId must be provided.");

        }


    }
}
