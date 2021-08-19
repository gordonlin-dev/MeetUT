using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class LookupHobbyCategory
    {
        public LookupHobbyCategory()
        {
            QuestionnaireHobbyCategories = new HashSet<QuestionnaireHobbyCategory>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<QuestionnaireHobbyCategory> QuestionnaireHobbyCategories { get; set; }
    }
}
