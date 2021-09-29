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
            var key = Encoding.ASCII.GetBytes("E48B0EE5E3988AE0018054A207E34CF818FDB5BC10CBCEDE41F46D28857A7654");
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
