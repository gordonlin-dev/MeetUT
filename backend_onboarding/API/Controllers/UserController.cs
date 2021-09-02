using System.Linq;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Collections.Generic;
using System;
using System.Collections;
using Microsoft.EntityFrameworkCore;

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
            finalResult = finalResult.OrderByDescending(x => x.CompatabilityScore).ToList();
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

        [HttpPost]
        [Route("Compatibility")]
        public JsonResult UpdateUserCompatibility(UserEmail userEmail)
        {
            var curUser = _context.Users.Where(x => x.Email == userEmail.Email).First();
            CalculateCompatibility(curUser);
            return new JsonResult("");
        }

        private void CalculateCompatibility(User user)
        {
            var insertList = new List<UserCompatability>();
            var updateList = new List<UserCompatability>();
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
                    ).ToList();
            var curUserProgramCategories = curUserPrograms.Join(
                        programCategories,
                        program => program.Id,
                        category => category.ProgramId,
                        (hobby, category) => category.CategoryId
                    ).ToList();
            var curUserHobbyCategoriesDict = GenerateCategoryDict(curUserHobbyCategories);

            var curUserProgramCategoriesDict = GenerateCategoryDict(curUserProgramCategories);


            foreach (var queriedUser in userQuery)
            {
                var queriedUserPrograms = GetUserPrograms(queriedUser.Id);
                var queriedUserHobbies = GetUserHobbies(queriedUser.Id);

                var query = compatabilityQuery.Where(x => x.User1Id == queriedUser.Id || x.User2Id == queriedUser.Id);

                var score = 0;
            
                var commonHobbies = curUserHobbies.Intersect(queriedUserHobbies).ToList();
                score += commonHobbies.Count * 2;
                score += CalculateHobbyCategoryCompatabilityScore(curUserHobbyCategoriesDict,
                    hobbyCategories, queriedUserHobbies);


                var commonPrograms = curUserPrograms.Intersect(queriedUserPrograms).ToList();
                score += commonPrograms.Count * 2;
                score += CalculateProgramCategoryCompatabilityScore(curUserProgramCategoriesDict,
                    programCategories, queriedUserPrograms);


                if (query.Any())
                {
                    var result = query.First();
                    result.CompatabilityScore = score;
                    _context.UserCompatabilities.Update(result);
                }
                else
                {
                    _context.UserCompatabilities.Add(new UserCompatability()
                    {
                        User1Id = user.Id,
                        User2Id = queriedUser.Id,
                        CompatabilityScore = score
                    });
                }

            }
            _context.SaveChanges();
           
        }

        private int CalculateHobbyCategoryCompatabilityScore(Dictionary<int,int> curUserHobbyCategoriesDict,
            List<QuestionnaireHobbyCategory> hobbyCategories, List<QuestionnaireHobby> queriedUserHobbies)
        {
            var score = 0;
            var queriedUserHobbyCategories = queriedUserHobbies.Join(
                        hobbyCategories,
                        hobby => hobby.Id,
                        category => category.HobbyId,
                        (hobby, category) => category.CategoryId
                    ).ToList();

            var queriedUserHobbyCategoryDict = GenerateCategoryDict(queriedUserHobbyCategories);

            foreach (var key in queriedUserHobbyCategoryDict.Keys)
            {
                int queriedUserValue = queriedUserHobbyCategoryDict[key];
                if (curUserHobbyCategoriesDict.TryGetValue(key, out int curUserValue))
                {
                    score += Math.Min(curUserValue, queriedUserValue);
                }
            }
            return score;
        }

        private int CalculateProgramCategoryCompatabilityScore(Dictionary<int,int> curUserProgramCategoriesDict,
            List<QuestionnaireProgramOfStudyCategory> programCategories, List<QuestionnaireProgramOfStudy> queriedUserPrograms)
        {
            var score = 0;
            var queriedUserProgramCategories = queriedUserPrograms.Join(
                        programCategories,
                        program => program.Id,
                        category => category.ProgramId,
                        (program, category) => category.CategoryId
                    );

            var queriedUserProgramCategoriesDict = GenerateCategoryDict(queriedUserProgramCategories);

            foreach (var key in queriedUserProgramCategoriesDict.Keys)
            {
                int queriedUserValue = queriedUserProgramCategoriesDict[key];
                if (curUserProgramCategoriesDict.TryGetValue(key, out int curUserValue))
                {
                    score += Math.Min(queriedUserValue, curUserValue);
                }

            }
            return score;
        }

        private Dictionary<int,int> GenerateCategoryDict(IEnumerable<int> categoryList)
        {
            var dict = new Dictionary<int, int>();
            foreach (var cat in categoryList)
            {
                if (dict.TryGetValue(cat, out int curValue))
                {
                    dict[cat] = curValue + 1;
                }
                else
                {
                    dict[cat] = 1;
                }
            }
            return dict;
        }
    }

    public class UserEmail
    {
        public string Email { get; set; }
        public UserEmail()
        {

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
