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
            var key = Encoding.ASCII.GetBytes("CAD19EFB02E3B1E8F3455300E355B544B9567C1D6E13FF47266A2B067562D99C");
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
                return id.ToString();
            }
            catch (Exception e)
            {
                return null;
            }
            
        }
    }
}
