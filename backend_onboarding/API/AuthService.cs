using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace API.AuthService
{
    public class AuthService
    {

        public static string DecodeJWT(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var secret = Environment.GetEnvironmentVariable("JWT_Secret");
            if(secret == null)
            {
                secret = "wz36Yu9kywCWib68qQNZ5LVt4bqo8LuBu8PmzvNFFK9uSS67OLQQ37XToT3ZKuR";
            }
            var key = Encoding.ASCII.GetBytes(secret);
            try
            {
                handler.ValidateToken(
                    token,
                    new TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = false,
                    },
                    out SecurityToken validatedToken
                );
                var jwtSecurityToken = (JwtSecurityToken) validatedToken;
                jwtSecurityToken.Payload.TryGetValue("_id", out object id);
                jwtSecurityToken.Payload.TryGetValue("active", out object active);
                if(! (bool)active)
                {
                    return null;
                }
                return id.ToString();
            }
            catch (Exception e)
            {
                return null;
            }
            
        }
    }
}
