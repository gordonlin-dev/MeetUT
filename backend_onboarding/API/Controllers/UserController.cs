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

        private List<QuestionnaireHobby> GetUserHobbies(User user)
        {
            return _context.UserHobbies.Where(x => x.UserId == user.Id).Join(
                    _context.QuestionnaireHobbies,
                    userHobby => userHobby.HobbyId,
                    hobby => hobby.Id,
                    (userHobby, hobby) => hobby
                ).ToList();
        }

        private List<QuestionnaireProgramOfStudy> GetUserPrograms(User user)
        {
            return _context.UserProgramOfStudies.Where(x => x.UserId == user.Id).Join(
                    _context.QuestionnaireProgramOfStudies,
                    userProgram => userProgram.ProgramId,
                    program => program.Id,
                    (userProgram, program) => program
                ).ToList();
        }


        [HttpPost]
        [Route("Recommendations")]
        public JsonResult GetUserRecommendations(UserRecommendationInput input)
        {
            var curUserQuery = _context.Users.Where(x => x.Email == input.CurUser);

            if (!curUserQuery.Any())
            {
                return new JsonResult("");
            }

            var curUser = curUserQuery.First();
            var userQuery = _context.Users.Where(x => x.Email != curUser.Email).ToList();
            if (input.ExcludedUsers.Any())
            {
                var matchedUserQuery = _context.Users.ToList().Join(
                    input.ExcludedUsers,
                    user => user.Email,
                    matchedUser => matchedUser,
                    (user, matchedUser) => user
                ).ToList();
                userQuery = userQuery.Except(matchedUserQuery).ToList();
            }
            userQuery.OrderBy(user => Util.CalculateDistance(user.MatchCoordinates, curUser.MatchCoordinates));
            var result = new List<RecommendationResult>();
            foreach(var user in userQuery.Take(100))
            {
                var recommendationResult = new RecommendationResult();
                recommendationResult.UserId = user.Email;
                recommendationResult.Hobbies = GetUserHobbies(user);
                recommendationResult.Programs = GetUserPrograms(user);
                result.Add(recommendationResult);
            }
            return new JsonResult(result);
        }

        

    }

    public class RecommendationResult
    {
        public string UserId { get; set; }
        public List<QuestionnaireHobby> Hobbies { get; set; }
        public List<QuestionnaireProgramOfStudy> Programs { get; set; }
        public RecommendationResult()
        {

        }
    }
    public class UserRecommendationInput
    {
        public string CurUser { get; set; }
        public List<string> ExcludedUsers { get; set; }
        public UserRecommendationInput()
        {

        }
    }
}
