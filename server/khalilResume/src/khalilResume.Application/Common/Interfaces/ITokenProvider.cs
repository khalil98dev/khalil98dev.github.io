namespace khalilResume.Application.Common.Interfaces;

public interface ITokenProvider
{
    string CreateToken(string userId, string email, IEnumerable<string> roles);
}