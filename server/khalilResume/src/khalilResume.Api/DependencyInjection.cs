using System.Text.Json.Serialization;
using Asp.Versioning;
using khalilResume.Api.Infrastructure;
using khalilResume.Api.Services;
using khalilResume.Application.Common.Interfaces;
using Serilog;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddProblemDetails(options =>
        {
            options.CustomizeProblemDetails = context =>
            {
                context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
                context.ProblemDetails.Extensions.Add("requestId", context.HttpContext.TraceIdentifier);
            };
        });

        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
        }).AddMvc();

        services.AddOpenApi();
        services.AddExceptionHandler<GlobalExceptionHandler>();

        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        });

        services.AddScoped<IUser, CurrentUser>();
        services.AddHttpContextAccessor();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
                policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
        });

        return services;
    }

    public static IApplicationBuilder UseCoreMiddlewares(this IApplicationBuilder app)
    {
        app.UseExceptionHandler();
        app.UseStatusCodePages();
        app.UseHttpsRedirection();
        app.UseSerilogRequestLogging();
        app.UseCors("AllowAll");
        app.UseAuthentication();
        app.UseAuthorization();

        return app;
    }
}