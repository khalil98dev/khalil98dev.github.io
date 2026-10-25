using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using khalilResume.Application.Common.Interfaces;

namespace khalilResume.Infrastructure.Identity;

public class TokenProvider(IConfiguration configuration) : ITokenProvider
{
    public string CreateToken(string userId, string email, IEnumerable<string> roles)
    {
        var secret = configuration["JwtSettings:Secret"] ?? "DefaultSuperSecretKeyWithSufficientLength123456!";
        var issuer = configuration["JwtSettings:Issuer"] ?? "khalilResume";
        var audience = configuration["JwtSettings:Audience"] ?? "khalilResumeAudience";

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.Email, email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}