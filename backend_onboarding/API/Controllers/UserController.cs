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

        
        public void SetUserMatchCoordinates(User user)
        {
            //[hobby,program]
            var coordinateList = new List<int>();
            //hobbies
            var hobbyQuery = _context.UserHobbies.Join(
                    _context.QuestionnaireHobbies,
                    userHobby => userHobby.HobbyId,
                    hobby => hobby.Id,
                    (userHobby, hobby) => hobby.MatchValue
                ).ToList();
            coordinateList.Add((int) hobbyQuery.Sum() / hobbyQuery.Count());

            var programQuery = _context.UserProgramOfStudies.Join(
                    _context.QuestionnaireProgramOfStudies,
                    userProgram => userProgram.ProgramId,
                    program => program.Id,
                    (userProgram, program) => program.MatchValue
                ).ToList();
            coordinateList.Add((int)programQuery.Sum() / programQuery.Count());
            user.MatchCoordinates = coordinateList.ToArray();
            _context.Update(user);
            _context.SaveChanges();
        }

    }
}
