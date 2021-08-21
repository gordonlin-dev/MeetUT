using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class LookupProgramOfStudyCategory
    {
        public LookupProgramOfStudyCategory()
        {
            QuestionnaireProgramOfStudyCategories = new HashSet<QuestionnaireProgramOfStudyCategory>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<QuestionnaireProgramOfStudyCategory> QuestionnaireProgramOfStudyCategories { get; set; }
    }
}
