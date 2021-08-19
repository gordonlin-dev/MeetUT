using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class LookupProgramOfStudyCategory
    {
        public LookupProgramOfStudyCategory()
        {
            QuestionnaireProgramOfStudyCategoriies = new HashSet<QuestionnaireProgramOfStudyCategoriie>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<QuestionnaireProgramOfStudyCategoriie> QuestionnaireProgramOfStudyCategoriies { get; set; }
    }
}
