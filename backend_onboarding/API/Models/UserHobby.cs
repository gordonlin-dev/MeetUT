using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserHobby
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int HobbyId { get; set; }

        public virtual QuestionnaireHobby Hobby { get; set; }
        public virtual User User { get; set; }
    }
}
