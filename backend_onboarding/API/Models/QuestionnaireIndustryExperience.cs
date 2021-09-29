using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireIndustryExperience
    {
        public QuestionnaireIndustryExperience()
        {
            UserIndustryExperiences = new HashSet<UserIndustryExperience>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<UserIndustryExperience> UserIndustryExperiences { get; set; }
    }
}
