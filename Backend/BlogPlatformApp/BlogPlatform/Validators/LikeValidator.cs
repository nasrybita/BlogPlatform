using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class LikeValidator : AbstractValidator<Like>
    {
        public LikeValidator()
        {

            RuleFor(l => l.PostId)
                .GreaterThan(0).WithMessage("PostId must be provided.");


            RuleFor(l => l.UserId)
                .GreaterThan(0).WithMessage("UserId must be provided.");

        }


    }
}
