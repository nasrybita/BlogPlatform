using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class PostValidator : AbstractValidator<Post>
    {
        public PostValidator()
        {

            RuleFor(p => p.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(255).WithMessage("Title cannot exceed 255 characters.");


            RuleFor(p => p.Slug)
                .NotEmpty().WithMessage("Slug is required.")
                .MaximumLength(255).WithMessage("Slug cannot exceed 255 characters.");


            RuleFor(p => p.Body)
                .NotEmpty().WithMessage("Body cannot be empty.")
                .MinimumLength(50).WithMessage("Body should be at least 50 characters long.");


            RuleFor(p => p.Status)
                .IsInEnum().WithMessage("Invalid post status.");


        }

    }
}
