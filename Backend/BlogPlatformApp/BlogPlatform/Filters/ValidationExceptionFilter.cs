using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using FluentValidation;


namespace BlogPlatform.Filters
{
    public class ValidationExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is ValidationException ex)
            {
                // Group the errors
                var errors = ex.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());



                var modelState = new ModelStateDictionary();
                foreach (var kv in errors)
                {
                    foreach (var message in kv.Value)
                        modelState.AddModelError(kv.Key ?? string.Empty, message);
                }

                // Create a ValidationProblemDetails response
                var problemDetails = new ValidationProblemDetails(modelState)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "One or more validation errors occurred."
                };

                context.Result = new BadRequestObjectResult(problemDetails);
                context.ExceptionHandled = true;

            }
        }
    }
}
