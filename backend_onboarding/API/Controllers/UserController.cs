using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController
    {
        private readonly ILogger<UserController> _logger;
        private readonly d80elsmr4eis6uContext context;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string GetUser()
        {
            return "user";
        }
    }
}
