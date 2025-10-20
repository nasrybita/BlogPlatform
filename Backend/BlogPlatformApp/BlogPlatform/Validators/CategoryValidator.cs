using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class CategoryValidator : AbstractValidator<Category>
    {
        public CategoryValidator()
        {

            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

            RuleFor(c => c.Slug)
                .NotEmpty().WithMessage("Slug is required.")
                .MaximumLength(255).WithMessage("Slug cannot exceed 255 characters."); ;

        }
    }
}
