using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class CommentValidator : AbstractValidator<Comment>
    {
        public CommentValidator()
        {
            RuleFor(c => c.PostId)
                .GreaterThan(0).WithMessage("PostId must be provided.");


            RuleFor(c => c.UserId)
                .GreaterThan(0).WithMessage("UserId must be provided.");


            RuleFor(c => c.CommentBody)
                .NotEmpty().WithMessage("Comment body cannot be empty.")
                .MaximumLength(1000).WithMessage("Comment too long.");


            RuleFor(c => c.Status)
                .IsInEnum().WithMessage("Invalid comment status.");
        }
    }
}
