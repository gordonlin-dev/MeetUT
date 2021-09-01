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

        private List<QuestionnaireHobby> GetUserHobbies(int userId)
        {
            return _context.UserHobbies.Where(x => x.UserId == userId).Join(
                    _context.QuestionnaireHobbies,
                    userHobby => userHobby.HobbyId,
                    hobby => hobby.Id,
                    (userHobby, hobby) => hobby
                ).ToList();
        }

        private List<QuestionnaireProgramOfStudy> GetUserPrograms(int userId)
        {
            return _context.UserProgramOfStudies.Where(x => x.UserId == userId).Join(
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
            var userQuery = _context.UserCompatabilities.Where(x => x.User1Id == curUser.Id || x.User2Id == curUser.Id).ToList();
            var query1 = _context.UserCompatabilities.Where(x => x.User1Id == curUser.Id).ToList();
            var query2 = _context.UserCompatabilities.Where(x => x.User2Id == curUser.Id).ToList();
            var result1 = query1.Join(
                    _context.Users,
                    userComp => userComp.User2Id,
                    user => user.Id,
                    (userComp, user) => new 
                    {
                        RecommendedUserEmail = user.Email,
                        RecommendedUserId = user.Id,
                        CompatabilityScore = userComp.CompatabilityScore
                    }
                );
            var result2 = query2.Join(
                    _context.Users,
                    userComp => userComp.User1Id,
                    user => user.Id,
                    (userComp, user) => new
                    {
                        RecommendedUserEmail = user.Email,
                        RecommendedUserId = user.Id,
                        CompatabilityScore = userComp.CompatabilityScore
                    }
                );

            if (input.ExcludedUsers.Any())
            {
                var matchedUserQuery1 = result1.Join(
                        input.ExcludedUsers,
                        recUser => recUser.RecommendedUserEmail,
                        matchedUser => matchedUser,
                        (recUser, matchedUser) => recUser
                    );
                var matchedUserQuery2 = result2.Join(
                        input.ExcludedUsers,
                        recUser => recUser.RecommendedUserEmail,
                        matchedUser => matchedUser,
                        (recUser, matchedUser) => recUser
                    );
                result1 = result1.Except(matchedUserQuery1).ToList();
                result2 = result2.Except(matchedUserQuery2).ToList();
            }
            var finalResult = result1.ToList();
            finalResult.AddRange(result2.ToList());
            finalResult.OrderBy(x => x.CompatabilityScore);
            var result = new List<RecommendationResult>();
            
            foreach(var user in finalResult.Take(100))
            {
                var recommendationResult = new RecommendationResult();
                recommendationResult.UserId = user.RecommendedUserEmail;
                recommendationResult.Hobbies = GetUserHobbies(user.RecommendedUserId);
                recommendationResult.Programs = GetUserPrograms(user.RecommendedUserId);
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
