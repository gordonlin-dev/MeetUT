using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireHobbyCategory
    {
        public int Id { get; set; }
        public int HobbyId { get; set; }
        public int CategoryId { get; set; }

        public virtual LookupHobbyCategory Category { get; set; }
        public virtual QuestionnaireHobby Hobby { get; set; }
    }
}
