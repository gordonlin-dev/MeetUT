using System;
using System.Collections.Generic;
using System.Linq;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
        public OkObjectResult GetHobbies()
        {
            var results = new List<HobbyCategoryResults>();

            var categories = _context.LookupHobbyCategories.ToList();
            foreach(var category in categories)
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
                    categoryId = category.Id,
                    categoryValue = category.Value,
                    content = query.ToList()
                });
            }
            return Ok(JsonConvert.SerializeObject(results.ToList()));
        }

        [HttpGet]
        [Route("Programs")]
        public OkObjectResult GetPrograms()
        {
            var results = new List<ProgramCategoryResults>();
            var categories = _context.LookupProgramOfStudyCategories.ToList();
            foreach(var category in categories)
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
                    categoryId = category.Id,
                    categoryValue = category.Value,
                    content = query.ToList()
                });
            }
            return Ok(JsonConvert.SerializeObject(results));
        }
    }
    public class ProgramCategoryResults
    {
        public int categoryId { get; set; }
        public string categoryValue { get; set; }
        public List<ProgramResults> content { get; set; }
        public ProgramCategoryResults()
        {
            content = new List<ProgramResults>();
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
        public int categoryId { get; set; }
        public string categoryValue { get; set; }
        public List<HobbyResults> content { get; set; }
        public HobbyCategoryResults()
        {
            content = new List<HobbyResults>();
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
