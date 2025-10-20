using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class ViewValidator : AbstractValidator<View>
    {
        public ViewValidator()
        {

            RuleFor(v => v.PostId)
                .GreaterThan(0).WithMessage("PostId must be provided.");


            RuleFor(v => v.ViewCount)
                .GreaterThanOrEqualTo(0).WithMessage("ViewCount cannot be negative."); ;

        }


    }
}
