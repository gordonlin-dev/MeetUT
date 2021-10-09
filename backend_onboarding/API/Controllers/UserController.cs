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
using API.AuthService;
using Microsoft.Extensions.Primitives;

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


        /*
        [HttpGet]
        [Route("Load")]
        public void Load()
        {
            string filePath = "DataSource/Countries.xlsx";
            using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                using (SpreadsheetDocument doc = SpreadsheetDocument.Open(fs, false))
                {
                    WorkbookPart workbookPart = doc.WorkbookPart;
                    SharedStringTablePart sstpart = workbookPart.GetPartsOfType<SharedStringTablePart>().First();
                    SharedStringTable sst = sstpart.SharedStringTable;

                    foreach(var item in sst)
                    {
                        _context.QuestionnaireCountries.Add(new QuestionnaireCountry()
                        {
                            Value = item.InnerText
                        });
                    }
                    _context.SaveChanges();
                }
            }

        }*/
        /*
        [HttpGet]
        [Route("Delete")]
        public void Delete()
        {            
            _context.UserCompatabilities.RemoveRange(_context.UserCompatabilities);
            _context.UserCountries.RemoveRange(_context.UserCountries);
            _context.UserDemographics.RemoveRange(_context.UserDemographics);
            _context.UserHobbies.RemoveRange(_context.UserHobbies);
            _context.UserIndustryExperiences.RemoveRange(_context.UserIndustryExperiences);            
            _context.UserLanguages.RemoveRange(_context.UserLanguages);
            _context.UserProgramOfStudies.RemoveRange(_context.UserProgramOfStudies);
            _context.UserProjectInterests.RemoveRange(_context.UserProjectInterests);
            _context.UserReasonsToJoins.RemoveRange(_context.UserReasonsToJoins);
            _context.UserReligions.RemoveRange(_context.UserReligions);
            _context.Users.RemoveRange(_context.Users);
            _context.SaveChanges();
        }
        */
        [HttpGet]
        public ActionResult GetUser()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            return new JsonResult(user);
        }

        [HttpPost]
        public ActionResult CreateUser(CreateUserInput input)
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            if (authorizationToken.ToString().Length == 0)
            {
                return Unauthorized();
            }
            var curUserEmail = AuthService.AuthService.DecodeJWT(authorizationToken.ToString().Split(" ")[1]);
            if (curUserEmail == null)
            {
                return Unauthorized();
            }

            var curUserQuery = _context.Users.Where(x => x.Email == curUserEmail);

            if (!curUserQuery.Any())
            {
                _context.Users.Add(new User() {
                    Email = curUserEmail,
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    CompletedOnboarding = false
                });
            }
            _context.SaveChanges();
            return new JsonResult("");
        }

        [HttpPost]
        [Route("Recommendations")]
        public ActionResult GetUserRecommendations(UserRecommendationInput input)
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var curUser = ValidateTokenAndGetUser(authorizationToken);
            if (curUser == null)
            {
                return Unauthorized();
            }
            if(!curUser.CompletedOnboarding)
            {
                return StatusCode(403);
            }
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
                var recommendedUser = _context.Users.Where(x => x.Id == user.RecommendedUserId).First();
                GetUserInfo( recommendedUser,
                    out List<QuestionnaireLanguage> languages,
                    out List<string> religions,
                    out int degreeType,
                    out int yearOfStudy,
                    out int college,
                    out List<QuestionnaireProgramOfStudy> programs,
                    out List<QuestionnaireReasonsToJoin> reasons,
                    out List<QuestionnaireProjectInterest> projects,
                    out List<QuestionnaireCountry> countries,
                    out List<QuestionnaireIndustryExperience> industries,
                    out List<QuestionnaireHobby> hobbies
                    );
                recommendationResult.Name = recommendedUser.FirstName + " " + recommendedUser.LastName;
                recommendationResult.Religions = religions;
                recommendationResult.Languages = languages;
                recommendationResult.DegreeType = degreeType;
                recommendationResult.YearOfStudy = yearOfStudy;
                recommendationResult.College = college;
                recommendationResult.Programs = programs;
                recommendationResult.Reason = reasons;
                recommendationResult.ProjectInterests = projects;
                recommendationResult.Countries = countries;
                recommendationResult.IndustryExperiences = industries;
                recommendationResult.Hobbies = hobbies;
                recommendationResult.UserId = recommendedUser.Id;
                result.Add(recommendationResult);
            }
            return new JsonResult(result);
        }

        [HttpPost]
        [Route("Compatibility")]
        public ActionResult UpdateUserCompatibility()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var curUser = ValidateTokenAndGetUser(authorizationToken);
            if (curUser == null)
            {
                return Unauthorized();
            }
            CalculateCompatibility(curUser);
            return new JsonResult("");
        }

        private void GetUserInfo(User user,
            out List<QuestionnaireLanguage> languages,
            out List<string> religions,
            out int degreeType,
            out int yearOfStudy,
            out int college,
            out List<QuestionnaireProgramOfStudy> programs,
            out List<QuestionnaireReasonsToJoin> reasons,
            out List<QuestionnaireProjectInterest> projectInterests,
            out List<QuestionnaireCountry> countries,
            out List<QuestionnaireIndustryExperience> industryExperience,
            out List<QuestionnaireHobby> hobbies)
        {

            languages = _context.UserLanguages.Where(x => x.UserId == user.Id).Join(
                    _context.QuestionnaireLanguages,
                    userLanguage => userLanguage.LanguageId,
                    language => language.Id,
                    (userLanguage, language) => language
                ).ToList();
            religions = _context.UserReligions.Where(x => x.UserId == user.Id).Select(x => x.Value).ToList();

            degreeType = user.DegreeType.HasValue? user.DegreeType.Value : 0;
            yearOfStudy = user.YearOfStudy.HasValue ? user.YearOfStudy.Value : 0;
            college = user.College.HasValue ? user.College.Value : 0;
            programs = _context.UserProgramOfStudies.Where(x => x.UserId == user.Id).Join(
                    _context.QuestionnaireProgramOfStudies,
                    userProgram => userProgram.ProgramId,
                    program => program.Id,
                    (userProgram, program) => program
                ).ToList();

            reasons = _context.UserReasonsToJoins.Where(x => x.Id == user.Id).Join(
                    _context.QuestionnaireReasonsToJoins,
                    userReason => userReason.ReasonId,
                    reason => reason.Id,
                    (userReason, reason) => reason
                ).ToList();
            projectInterests = _context.UserProjectInterests.Where(x => x.Id == user.Id).Join(
                    _context.QuestionnaireProjectInterests,
                    userProject => userProject.ProjectInterestId,
                    project => project.Id,
                    (userProject, project) => project
                ).ToList();
            countries = _context.UserCountries.Where(x => x.Id == user.Id).Join(
                    _context.QuestionnaireCountries,
                    userCountry => userCountry.CountryId,
                    country => country.Id,
                    (userCountry, country) => country
                ).ToList();
            industryExperience = _context.UserIndustryExperiences.Where(x => x.Id == user.Id).Join(
                    _context.QuestionnaireIndustryExperiences,
                    userIndustry => userIndustry.IndustryExperienceId,
                    industry => industry.Id,
                    (userIndustry, industry) => industry
                ).ToList();
            hobbies = _context.UserHobbies.Where(x => x.UserId == user.Id).Join(
                    _context.QuestionnaireHobbies,
                    userHobby => userHobby.HobbyId,
                    hobby => hobby.Id,
                    (userHobby, hobby) => hobby
                ).ToList();
        }

        private void CalculateCompatibility(User user)
        {

            var insertList = new List<UserCompatability>();
            var updateList = new List<UserCompatability>();
            GetUserInfo (user,
                out List<QuestionnaireLanguage> curUserLanguages,
                out List<string> curUserReligions,
                out int curUserDegreeType,
                out int curUserYearOfStudy,
                out int curUserCollege,
                out List<QuestionnaireProgramOfStudy> curUserPrograms,
                out List<QuestionnaireReasonsToJoin> curUserReasons,
                out List<QuestionnaireProjectInterest> curUserProjectInterests,
                out List<QuestionnaireCountry> curUserCountries,
                out List<QuestionnaireIndustryExperience> curUserIndustryExperience,
                out List<QuestionnaireHobby> curUserHobbies);

            var compatabilityQuery = _context.UserCompatabilities.Where(x =>
                x.User1Id == user.Id || x.User2Id == user.Id).ToList();

            var userQuery = _context.Users.Where(x => x.Id != user.Id && x.CompletedOnboarding).ToList();

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
                GetUserInfo(
                    queriedUser,
                    out List<QuestionnaireLanguage> queriredUserLanguages,
                    out List<string> queriedUserReligions,
                    out int queriedUserDegreeType,
                    out int queriedUserYearOfStudy,
                    out int queriedUserCollege,
                    out List<QuestionnaireProgramOfStudy> queriedUserPrograms,
                    out List<QuestionnaireReasonsToJoin> queriedUserReasons,
                    out List<QuestionnaireProjectInterest> queriedUserProjectInterests,
                    out List<QuestionnaireCountry> queriedUserCountries,
                    out List<QuestionnaireIndustryExperience> queriedUserIndustryExperience,
                    out List<QuestionnaireHobby> queriedUserHobbies
                );

                var query = compatabilityQuery.Where(x => x.User1Id == queriedUser.Id || x.User2Id == queriedUser.Id);

                var score = 0;

                

                var commonLanguages = curUserLanguages.Intersect(queriredUserLanguages).ToList();
                score += commonLanguages.Count * 2;

                var commonReligions = curUserReligions.Intersect(queriedUserReligions).ToList();
                score += commonReligions.Count * 2;


                if (curUserDegreeType == queriedUserDegreeType)
                {
                    score += 2;
                }
                if (curUserYearOfStudy == queriedUserYearOfStudy)
                {
                    score += 2;
                }
                if (curUserCollege == queriedUserCollege)
                {
                    score += 2;
                }
                var commonPrograms = curUserPrograms.Intersect(queriedUserPrograms).ToList();
                score += commonPrograms.Count * 2;
                score += CalculateProgramCategoryCompatabilityScore(curUserProgramCategoriesDict,
                    programCategories, queriedUserPrograms);


                var commonReasons = curUserReasons.Intersect(queriedUserReasons).ToList();
                score += commonReasons.Count * 2;
                var commonProjects = curUserProjectInterests.Intersect(queriedUserProjectInterests).ToList();
                score += commonProjects.Count * 2;
                var commonIndustry = curUserIndustryExperience.Intersect(queriedUserIndustryExperience).ToList();
                score += commonIndustry.Count * 2;
                var commonCountries = curUserCountries.Intersect(queriedUserCountries).ToList();
                score += commonCountries.Count * 2;
                var commonHobbies = curUserHobbies.Intersect(queriedUserHobbies).ToList();
                score += commonHobbies.Count * 2;
                score += CalculateHobbyCategoryCompatabilityScore(curUserHobbyCategoriesDict,
                    hobbyCategories, queriedUserHobbies);


             
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
            user.CompletedOnboarding = true;
            _context.Users.Update(user);
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

        private User ValidateTokenAndGetUser(StringValues token)
        {

            if (token.ToString().Length == 0)
            {
                return null;
            }
            var curUserEmail = AuthService.AuthService.DecodeJWT(token.ToString().Split(" ")[1]);
            if (curUserEmail == null)
            {
                return null;
            }
            var query = _context.Users.Where(x => x.Email == curUserEmail);
            var curUser = query.FirstOrDefault();
            if (!query.Any())
            {
                var newUser = new User()
                {
                    Email = curUserEmail
                };
                _context.Users.Add(newUser);
                _context.SaveChanges();
                curUser = newUser;
            }
            return curUser;
        }
    }

    public class CreateUserInput
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public CreateUserInput()
        {

        }
    }

    public class RecommendationResult
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public List<string> Religions { get; set; }
        public List<QuestionnaireLanguage> Languages { get; set; }
        public int DegreeType { get; set; }
        public int YearOfStudy { get; set; }
        public int College { get; set; }
        public List<QuestionnaireProgramOfStudy> Programs { get; set; }
        public List<QuestionnaireReasonsToJoin> Reason { get; set; }
        public List<QuestionnaireIndustryExperience> IndustryExperiences { get; set; }
        public List<QuestionnaireProjectInterest> ProjectInterests { get; set; }
        public List<QuestionnaireCountry> Countries { get; set; }
        public List<QuestionnaireHobby> Hobbies { get; set; }
        
        public RecommendationResult()
        {

        }
    }
    public class UserRecommendationInput
    {
        public List<string> ExcludedUsers { get; set; }
        public UserRecommendationInput()
        {

        }
    }
}
