using Microsoft.AspNetCore.Identity;

namespace khalilResume.Infrastructure.Identity;

public class AppUser : IdentityUser
{
    public string? FullName { get; set; }
}