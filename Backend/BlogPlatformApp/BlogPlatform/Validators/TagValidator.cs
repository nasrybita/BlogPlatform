using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class TagValidator : AbstractValidator<Tag>
    {
        public TagValidator()
        {

            RuleFor(t => t.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(50).WithMessage("Name cannot exceed 50 characters.");


            RuleFor(t => t.Slug)
                .NotEmpty().WithMessage("Slug is required.")
                .MaximumLength(100).WithMessage("Slug cannot exceed 100 characters.");

        }
    }
}
