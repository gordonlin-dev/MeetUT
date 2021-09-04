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
