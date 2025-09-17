using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TaskApi.Model;

namespace TaskApi.Services
{
    public class MyJwtService(IConfiguration _configuration)
    {
        private readonly IConfiguration _configuration;

        public string GenerateToken(TodoUser todoUser)
        {
            Claim[] claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, todoUser.Name),
                new Claim(ClaimTypes.NameIdentifier, todoUser.UserId.ToString())
            };
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("b7f3a9c2e4d1f8a6b3c9d7e2f1a4c6b8"));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            JwtSecurityToken token = new JwtSecurityToken(
                        issuer: "your_issuer",
                        audience: "your_audience",
                        claims: claims,
                        expires: DateTime.UtcNow.AddHours(1),
                        signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
