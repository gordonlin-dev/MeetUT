using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireProgramOfStudy
    {
        public QuestionnaireProgramOfStudy()
        {
            QuestionnaireProgramOfStudyCategories = new HashSet<QuestionnaireProgramOfStudyCategory>();
            UserProgramOfStudies = new HashSet<UserProgramOfStudy>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<QuestionnaireProgramOfStudyCategory> QuestionnaireProgramOfStudyCategories { get; set; }
        public virtual ICollection<UserProgramOfStudy> UserProgramOfStudies { get; set; }
    }
}
