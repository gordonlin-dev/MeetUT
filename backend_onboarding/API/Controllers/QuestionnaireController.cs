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

        [HttpGet]
        [Route("Hobbies")]
        public ActionResult GetHobbies()
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
                            Value = hobby.Value
                        }
                    );
                results.Add(new HobbyCategoryResults() {
                    CategoryId = category.Id,
                    CategoryValue = category.Value,
                    Content = query.ToList()
                });
            }
            return new JsonResult(results.ToList());
        }

        [HttpGet]
        [Route("Programs")]
        public ActionResult GetPrograms()
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
                            ProgramId = program.Id
                        }
                    );
                results.Add(new ProgramCategoryResults() {
                    CategoryId = category.Id,
                    CategoryValue = category.Value,
                    Content = query.ToList()
                });
            }
            return new JsonResult(results);
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
                userHobbies.Add(new UserHobby() {
                    HobbyId = hobby.HobbyId,
                    UserId = curUser.Id
                });
            }
            _context.UserHobbies.AddRange(userHobbies);
            _context.SaveChanges();
            return new JsonResult("");
        }
        [HttpPost]
        [Route("Programs")]
        public ActionResult UpdateUserPrograms(UserProgramModel model)
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
            var query2 = _context.UserProgramOfStudies.Where(x => x.UserId == curUser.Id);
            if (query2.Any())
            {
                _context.UserProgramOfStudies.RemoveRange(query2);
                _context.SaveChanges();
            }

            var userPrograms = new List<UserProgramOfStudy>();
            foreach(var program in model.Programs)
            {
                userPrograms.Add(new UserProgramOfStudy() {
                    UserId = curUser.Id,
                    ProgramId = program.ProgramId
                });
            }
            _context.UserProgramOfStudies.AddRange(userPrograms);
            _context.SaveChanges();
            return new JsonResult("");
        }
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
            if(user == null)
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
            foreach(var languageId in model.Languages)
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
    public class UserProgramModel
    {
        public List<ProgramResults> Programs { get; set; }
        public UserProgramModel()
        {

        }
    }

    public class UserHobbyModel
    {
        public List<HobbyResults> Hobbies { get; set; }

        public UserHobbyModel()
        {

        }
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
        public ProgramResults()
        {

        }
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
        public HobbyResults()
        {

        }
    }
}
