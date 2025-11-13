using BlogPlatform.DTOs.Requests;
using FluentValidation;

namespace BlogPlatform.Validators.Post
{
    public class PostCreateDtoValidator : AbstractValidator<PostCreateDto>
    {
        public PostCreateDtoValidator() 
        {
            RuleFor(p => p.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(255).WithMessage("Title cannot exceed 255 characters.");


            RuleFor(p => p.Slug)
                .NotEmpty().WithMessage("Slug is required.")
                .Matches("^[a-z0-9]+(-[a-z0-9]+)*$").WithMessage("Slug must be lowercase and words separated by dashes (e.g., 'my-first-post').")
                .MaximumLength(255).WithMessage("Slug cannot exceed 255 characters.");


            RuleFor(p => p.Body)
                .NotEmpty().WithMessage("Body is required.")
                .MinimumLength(50).WithMessage("Body should be at least 50 characters long.");


            When(p => p.Categories != null, () =>
            {
                RuleForEach(p => p.Categories)
                    .NotEmpty().WithMessage("Category name cannot be empty.")
                    .MaximumLength(100).WithMessage("Category name cannot exceed 100 characters.");
            });

            
            When(p => p.Tags != null, () =>
            {
                RuleForEach(p => p.Tags)
                    .NotEmpty().WithMessage("Tag name cannot be empty.")
                    .MaximumLength(50).WithMessage("Tag name cannot exceed 50 characters.");
            });
        }
    }
}
