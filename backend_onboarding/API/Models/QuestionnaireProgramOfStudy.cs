using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireProgramOfStudy
    {
        public QuestionnaireProgramOfStudy()
        {
            QuestionnaireProgramOfStudyCategoriies = new HashSet<QuestionnaireProgramOfStudyCategoriie>();
            UserProgramOfStudies = new HashSet<UserProgramOfStudy>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<QuestionnaireProgramOfStudyCategoriie> QuestionnaireProgramOfStudyCategoriies { get; set; }
        public virtual ICollection<UserProgramOfStudy> UserProgramOfStudies { get; set; }
    }
}
