using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserIndustryExperience
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int IndustryExperienceId { get; set; }

        public virtual QuestionnaireIndustryExperience IndustryExperience { get; set; }
        public virtual User User { get; set; }
    }
}
