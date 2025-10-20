using BlogPlatform.Models;
using FluentValidation;

namespace BlogPlatform.Validators
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {

            RuleFor(u => u.Username)
                .NotEmpty().WithMessage("Username is required.")
                .MaximumLength(100).WithMessage("Username cannot exceed 100 characters.");



            RuleFor(u => u.Email)
                .NotEmpty().WithMessage("Email is required.")
                .MaximumLength(150).WithMessage("Email cannot exceed 150 characters.")
                .EmailAddress().WithMessage("Invalid email format.");


            RuleFor(u => u.PasswordHash)
                .NotEmpty().WithMessage("PasswordHash is required.")
                .MinimumLength(6).WithMessage("PasswordHash must be at least 6 characters long.")
                .MaximumLength(255).WithMessage("PasswordHash cannot exceed 255 characters.");



            RuleFor(u => u.Role)
                .IsInEnum().WithMessage("Invalid user role");


        }
    }
}
