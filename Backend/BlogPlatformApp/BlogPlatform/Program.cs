using AutoMapper;
using BlogPlatform.Data;
using BlogPlatform.Filters;
using BlogPlatform.Mappings;
using BlogPlatform.Models;
using BlogPlatform.Repositories.Implementations;
using BlogPlatform.Repositories.Interfaces;
using BlogPlatform.Services.Implementations;
using BlogPlatform.Services.Interfaces;
using BlogPlatform.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.



//...
// Add CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        p => p.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});



//...
// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


//...
// Add Controllers with ValidationExceptionFilter and JSON options
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationExceptionFilter>();
})
.AddJsonOptions(opts =>
{
    //Makes enums be displayed as "Draft" or "Published" instead of 0 or 1 in JSON responses
    opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});


//...
// Repositories
builder.Services.AddScoped<IPostRepository, PostRepository>();


//...
// Services
builder.Services.AddScoped<IPostService, PostService>();



//...
// AutoMapper configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));


//...
// Add FluentValidation
// Validators
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
