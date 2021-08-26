using System.Linq;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Collections.Generic;
using System;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly d80elsmr4eis6uContext _context;

        public UserController(ILogger<UserController> logger, d80elsmr4eis6uContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public string GetUser()
        {
            return "1234";
        }

        [HttpGet]
        [Route("Recommendations")]
        public JsonResult GetUserRecommendations(UserRecommendationInput input)
        {
            var curUserQuery = _context.Users.Where(x => x.Email == input.curUser);

            if (!curUserQuery.Any())
            {
                return null;
            }

            var curUser = curUserQuery.First();
            var userQuery = _context.Users.Where(x => x.Email != curUser.Email).ToList();
            var matchedUserQuery = _context.Users.Join(
                    input.matchedUsers,
                    user => user.Email,
                    matchedUser => matchedUser,
                    (user, matchedUser) => user
                ).ToList();
            userQuery = userQuery.Except(matchedUserQuery).ToList();
            userQuery.OrderBy(user => Util.CalculateDistance(user.MatchCoordinates, curUser.MatchCoordinates));
            return null;
        }

        

    }

    public class UserRecommendationInput
    {
        public string curUser { get; set; }
        public List<string> matchedUsers { get; set; }
        public UserRecommendationInput()
        {

        }
    }
}
