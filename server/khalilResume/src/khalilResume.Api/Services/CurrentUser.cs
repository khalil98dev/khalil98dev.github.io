using System.Security.Claims;
using khalilResume.Application.Common.Interfaces;

namespace khalilResume.Api.Services;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : IUser
{
    public string? Id => httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
}