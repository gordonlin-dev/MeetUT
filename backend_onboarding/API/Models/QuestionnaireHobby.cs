using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireHobby
    {
        public QuestionnaireHobby()
        {
            QuestionnaireHobbyCategories = new HashSet<QuestionnaireHobbyCategory>();
            UserHobbies = new HashSet<UserHobby>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<QuestionnaireHobbyCategory> QuestionnaireHobbyCategories { get; set; }
        public virtual ICollection<UserHobby> UserHobbies { get; set; }
    }
}
