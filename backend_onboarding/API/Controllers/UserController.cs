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

        private void CalculateCompatibility(User user)
        {
            var curUserPrograms = GetUserPrograms(user.Id);
            var curUserHobbies = GetUserHobbies(user.Id);
            var compatabilityQuery = _context.UserCompatabilities.Where(x =>
                x.User1Id == user.Id || x.User2Id == user.Id).ToList();

            var userQuery = _context.Users.Where(x => x.Id != user.Id).ToList();
            var hobbyCategories = _context.QuestionnaireHobbyCategories.ToList();
            var programCategories = _context.QuestionnaireProgramOfStudyCategories.ToList();

            var curUserHobbyCategories = curUserHobbies.Join(
                        hobbyCategories,
                        hobby => hobby.Id,
                        category => category.HobbyId,
                        (hobby, category) => category.CategoryId
                    );
            var curUserProgramCategories = curUserPrograms.Join(
                        programCategories,
                        program => program.Id,
                        category => category.ProgramId,
                        (hobby, category) => category.CategoryId
                    );
            var curUserHobbyCategoriesDict = new Dictionary<int, int>();
            foreach(var cat in curUserHobbyCategories)
            {
                if (curUserHobbyCategoriesDict.TryGetValue(cat, out int curValue))
                {
                    curUserHobbyCategoriesDict[cat] = curValue + 1;
                }
                else
                {
                    curUserHobbyCategoriesDict[cat] = 1;
                }

            }
            var curUserProgramCategoriesDict = new Dictionary<int, int>();
            foreach(var cat in curUserProgramCategories)
            {
                int curValue = 0;
                if (curUserProgramCategoriesDict.TryGetValue(cat, out curValue))
                {
                    curUserProgramCategoriesDict[cat] = curValue + 1;
                }
                else
                {
                    curUserProgramCategoriesDict[cat] = 1;
                }
            }

            foreach (var queriedUser in userQuery)
            {
                var queriedUserPrograms = GetUserPrograms(queriedUser.Id);
                var queriedUserHobbies = GetUserHobbies(queriedUser.Id);
                var query = compatabilityQuery.Where(x => x.User1Id == queriedUser.Id
                    || x.User2Id == queriedUser.Id);
                
                UserCompatability compatability;
                if (!query.Any())
                {
                    compatability = new UserCompatability()
                    {
                        User1Id = user.Id,
                        User2Id = queriedUser.Id,
                        CompatabilityScore = 0
                    };
                }
                else
                {
                    compatability = compatabilityQuery.First();
                    compatability.CompatabilityScore = 0;
                }
                var commonHobbies = curUserHobbies.Intersect(queriedUserHobbies).ToList();
                compatability.CompatabilityScore += commonHobbies.Count * 2;

                var queriedUserHobbyCategories = queriedUserHobbies.Join(
                        hobbyCategories,
                        hobby => hobby.Id,
                        category => category.HobbyId,
                        (hobby, category) => category.CategoryId
                    ).ToList();
                var queriedUserHobbyCategoryDict = new Dictionary<int, int>();
                foreach(var cat in queriedUserHobbyCategories)
                {
                    if (queriedUserHobbyCategoryDict.TryGetValue(cat, out int curValue))
                    {
                        queriedUserHobbyCategoryDict[cat] = curValue + 1;
                    }
                    else
                    {
                        queriedUserHobbyCategoryDict[cat] = 1;
                    }
                }
                foreach(var key in queriedUserHobbyCategoryDict.Keys)
                {
                    int queriedUserValue = queriedUserHobbyCategoryDict[key];
                    if (curUserHobbyCategoriesDict.TryGetValue(key, out int curUserValue))
                    {
                        compatability.CompatabilityScore += Math.Min(curUserValue, queriedUserValue);
                    }
                }
                var commonPrograms = curUserPrograms.Intersect(queriedUserPrograms).ToList();
                compatability.CompatabilityScore += commonPrograms.Count * 2;
                var queriedUserProgramCategories = queriedUserPrograms.Join(
                        programCategories,
                        program => program.Id,
                        category => category.ProgramId,
                        (program, category) => category.CategoryId
                    );

                var queriedUserProgramCategoriesDict = new Dictionary<int, int>();
                foreach (var cat in queriedUserProgramCategories)
                {
                    if(queriedUserProgramCategoriesDict.TryGetValue(cat, out int value))
                    {
                        queriedUserProgramCategoriesDict[cat] = value + 1;
                    }
                    else
                    {
                        queriedUserProgramCategoriesDict[cat] = 1;
                    }
                }
                foreach(var key in queriedUserProgramCategoriesDict.Keys)
                {
                    int queriedUserValue = queriedUserProgramCategoriesDict[key];
                    if(curUserProgramCategoriesDict.TryGetValue(key, out int curUserValue))
                    {
                        compatability.CompatabilityScore += Math.Min(queriedUserValue, curUserValue);
                    }

                }
                _context.UserCompatabilities.Add(compatability);
            }
            _context.SaveChanges();
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
