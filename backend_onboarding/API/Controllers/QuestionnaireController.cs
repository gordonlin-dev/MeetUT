using System;
using System.Collections.Generic;
using System.Linq;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuestionnaireController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly d80elsmr4eis6uContext _context;

        public QuestionnaireController(ILogger<UserController> logger, d80elsmr4eis6uContext context)
        {
            _logger = logger;
            _context = context;
        }


        #region Academic
        [HttpGet]
        [Route("Academics")]
        public ActionResult GetAcademics()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }

            var model = new UserAcademicsModel()
            {
                DegreeType = user.DegreeType,
                YearOfStudy = user.YearOfStudy,
                College = user.College,
                Programs = GetPrograms()
            };
            return new JsonResult(model);
        }

        [HttpPost]
        [Route("Academics")]
        public ActionResult UpdateAcademics(UserAcademicsModel model)
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            user.DegreeType = model.DegreeType;
            user.YearOfStudy = model.YearOfStudy;
            user.College = model.College;
            UpdateUserPrograms(user, model);

            return new JsonResult("");
        }

        private List<ProgramCategoryResults> GetPrograms()
        {        
            var results = new List<ProgramCategoryResults>();
            var categories = _context.LookupProgramOfStudyCategories.ToList();
            foreach (var category in categories)
            {
                var query = _context.QuestionnaireProgramOfStudyCategories.
                    Where(x => x.CategoryId == category.Id).
                    Join(
                        _context.QuestionnaireProgramOfStudies,
                        programCategory => programCategory.ProgramId,
                        program => program.Id,
                        (programCategory, program) => new ProgramResults()
                        {
                            Value = program.Value,
                            ProgramId = program.Id,
                            CategoryIds = program.QuestionnaireProgramOfStudyCategories.Select(x => x.CategoryId).ToList()
                        }
                    );
                results.Add(new ProgramCategoryResults()
                {
                    CategoryId = category.Id,
                    CategoryValue = category.Value,
                    Content = query.ToList()
                });
            }
            return results;
        }

        private void UpdateUserPrograms(User curUser, UserAcademicsModel model)
        {
            var query2 = _context.UserProgramOfStudies.Where(x => x.UserId == curUser.Id);
            if (query2.Any())
            {
                _context.UserProgramOfStudies.RemoveRange(query2);
                _context.SaveChanges();
            }

            var userPrograms = new List<UserProgramOfStudy>();
            foreach (var program in model.SelectedPrograms)
            {
                userPrograms.Add(new UserProgramOfStudy()
                {
                    UserId = curUser.Id,
                    ProgramId = program.ProgramId
                });
            }
            _context.UserProgramOfStudies.AddRange(userPrograms);
            _context.SaveChanges();
        }
        #endregion


        [HttpGet]
        [Route("Demographics/Languages")]
        public ActionResult GetLanguages()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            var result = _context.QuestionnaireLanguages.ToList();
            return new JsonResult(result);
        }

        [HttpPost]
        [Route("Demographics")]
        public ActionResult UpdateUserDemoprahics(UserDemographicsModel model)
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            _context.Users.Update(user);
            var query = _context.UserDemographics.Where(x => x.UserId == user.Id).ToList();
            if (query.Any())
            {
                var result = query.First();
                result.DateOfBirth = model.DateOfBirth;
                result.Gender = model.Gender;
                _context.UserDemographics.Update(result);
            }
            else
            {
                _context.UserDemographics.Add(new UserDemographic() {
                    UserId = user.Id,
                    DateOfBirth = model.DateOfBirth,
                    Gender = model.Gender
                });
            }

            var query2 = _context.UserReligions.Where(x => x.UserId == user.Id).ToList();
            if (query2.Any())
            {
                _context.UserReligions.RemoveRange(query2);
            }
            _context.UserReligions.Add(new UserReligion()
            {
                UserId = user.Id,
                Value = model.Religion
            });
            var query3 = _context.UserLanguages.Where(x => x.UserId == user.Id).ToList();
            if (query3.Any())
            {
                _context.UserLanguages.RemoveRange(query3);
            }
            foreach (var languageId in model.Languages)
            {
                _context.UserLanguages.Add(new UserLanguage() {
                    UserId = user.Id,
                    LanguageId = languageId
                });
            }
            _context.SaveChanges();

            return new JsonResult("");
        }
        [HttpGet]
        [Route("Personal/IndustryExperience")]
        public ActionResult GetIndustryExperience()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            var result = _context.QuestionnaireIndustryExperiences.ToList();
            return new JsonResult(result);

        }

        [HttpGet]
        [Route("Personal/ProjectInterest")]
        public ActionResult GetProjectInterest()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            var result = _context.QuestionnaireProjectInterests.ToList();
            return new JsonResult(result);
        }

        [HttpGet]
        [Route("Personal/Reasons")]
        public ActionResult GetReasons()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            var result = _context.QuestionnaireReasonsToJoins.ToList();
            return new JsonResult(result);
        }

        [HttpGet]
        [Route("Personal/Countries")]
        public ActionResult GetCountries()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            var result = _context.QuestionnaireCountries.ToList();
            return new JsonResult(result);
        }

        #region Personal
        [HttpGet]
        [Route("Personal")]
        public ActionResult GetPersonal()
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }

            var model = new UserPersonalModel()
            {
                ReasonsToJoin = _context.QuestionnaireReasonsToJoins.ToList(),
                CountriesLivedIn = _context.QuestionnaireCountries.ToList(),
                IndustryExperiences = _context.QuestionnaireIndustryExperiences.ToList(),
                ProjectInterests = _context.QuestionnaireProjectInterests.ToList(),
                Hobbies = GetHobbies()
            };
            return new JsonResult(model);

        }

        private List<HobbyCategoryResults> GetHobbies()
        {
            var results = new List<HobbyCategoryResults>();

            var categories = _context.LookupHobbyCategories.ToList();
            foreach (var category in categories)
            {
                var query = _context.QuestionnaireHobbyCategories.
                    Where(x => x.CategoryId == category.Id).Join(
                        _context.QuestionnaireHobbies,
                        hobbyCategory => hobbyCategory.HobbyId,
                        hobby => hobby.Id,
                        (hobbyCategory, hobby) => new HobbyResults()
                        {
                            HobbyId = hobby.Id,
                            Value = hobby.Value,
                            CategoryIds = hobby.QuestionnaireHobbyCategories.Select(x => x.CategoryId).ToList()
                        }
                    );
                results.Add(new HobbyCategoryResults()
                {
                    CategoryId = category.Id,
                    CategoryValue = category.Value,
                    Content = query.ToList()
                });
            }
            return results;
        }

        [HttpPost]
        [Route("Hobbies")]
        public ActionResult UpdateUserHobbies(UserHobbyModel model)
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
            var query2 = _context.UserHobbies.Where(x => x.UserId == curUser.Id);
            if (query2.Any())
            {
                _context.UserHobbies.RemoveRange(query2);
                _context.SaveChanges();
            }
            var userHobbies = new List<UserHobby>();
            foreach (var hobby in model.Hobbies)
            {
                userHobbies.Add(new UserHobby()
                {
                    HobbyId = hobby.HobbyId,
                    UserId = curUser.Id
                });
            }
            _context.UserHobbies.AddRange(userHobbies);
            _context.SaveChanges();
            return new JsonResult("");
        }


        #endregion
        [HttpPost]
        [Route("Personal1")]
        public ActionResult UpdatePersonalExperiencesAndInterests(UserPersonalModel model)
        {
            StringValues authorizationToken;
            Request.Headers.TryGetValue("Authorization", out authorizationToken);
            var user = ValidateTokenAndGetUser(authorizationToken);
            if (user == null)
            {
                return Unauthorized();
            }
            var queryIndursty = _context.UserIndustryExperiences.Where(x => x.UserId == user.Id);
            if (queryIndursty.Any())
            {
                _context.UserIndustryExperiences.RemoveRange(queryIndursty);
            }
            foreach(var industryExperienceId in model.IndustryExperiences)
            {
                _context.UserIndustryExperiences.Add(new UserIndustryExperience() {
                    UserId = user.Id,
                    IndustryExperienceId = industryExperienceId.Id
                });
            }

            var queryReasons = _context.UserReasonsToJoins.Where(x => x.UserId == user.Id);
            if (queryReasons.Any())
            {
                _context.UserReasonsToJoins.RemoveRange(queryReasons);
            }
            foreach(var reasonId in model.ReasonsToJoin)
            {
                _context.UserReasonsToJoins.Add(new UserReasonsToJoin() {
                    UserId = user.Id,
                    ReasonId = reasonId.Id
                });
            }

            var queryCountries = _context.UserCountries.Where(x => x.UserId == user.Id);
            if (queryCountries.Any())
            {
                _context.UserCountries.RemoveRange(queryCountries);
            }
            foreach(var countryId in model.CountriesLivedIn)
            {
                _context.UserCountries.Add(new UserCountry() {
                    UserId = user.Id,
                    CountryId = countryId.Id
                });
            }

            var queryProjectInterest = _context.UserProjectInterests.Where(x => x.UserId == user.Id);
            if (queryProjectInterest.Any())
            {
                _context.UserProjectInterests.RemoveRange(queryProjectInterest);
            }
            foreach(var interestId in model.ProjectInterests)
            {
                _context.UserProjectInterests.Add(new UserProjectInterest() {
                    UserId = user.Id,
                    ProjectInterestId = interestId.Id
                });
            }
            _context.SaveChanges();
            return new JsonResult("");
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


    public class UserDemographicsModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<int> Languages { get; set; }
        public string Religion { get; set; }
    }

    public class UserHobbyModel
    {
        public List<HobbyResults> Hobbies { get; set; }

        public UserHobbyModel()
        {

        }
    }

    #region Academics
    public class UserAcademicsModel
    {
        public List<ProgramCategoryResults> Programs { get; set; }
        public int? DegreeType { get; set; }
        public int? YearOfStudy { get; set; }
        public int? College { get; set; }
        public List<ProgramResults> SelectedPrograms { get; set; }
    }

    public class ProgramCategoryResults
    {
        public int CategoryId { get; set; }
        public string CategoryValue { get; set; }
        public List<ProgramResults> Content { get; set; }
        public ProgramCategoryResults()
        {
            Content = new List<ProgramResults>();
        }
    }

    public class ProgramResults
    {
        public int ProgramId { get; set; }
        public string Value { get; set; }
        public List<int> CategoryIds { get; set; }
        public ProgramResults()
        {

        }
    }
    #endregion

    #region Personal
    public class UserPersonalModel
    {
        public List<QuestionnaireReasonsToJoin> ReasonsToJoin { get; set; }
        public List<QuestionnaireIndustryExperience> IndustryExperiences { get; set; }
        public List<QuestionnaireCountry> CountriesLivedIn { get; set; }
        public List<QuestionnaireProjectInterest> ProjectInterests { get; set; }
        public List<HobbyCategoryResults> Hobbies { get; set; }
    }
    public class HobbyCategoryResults
    {
        public int CategoryId { get; set; }
        public string CategoryValue { get; set; }
        public List<HobbyResults> Content { get; set; }
        public HobbyCategoryResults()
        {
            Content = new List<HobbyResults>();
        }
    }

    public class HobbyResults
    {
        public int HobbyId { get; set; }
        public string Value { get; set; }
        public List<int> CategoryIds { get; set; }
        public HobbyResults()
        {

        }
    }
    #endregion

}
