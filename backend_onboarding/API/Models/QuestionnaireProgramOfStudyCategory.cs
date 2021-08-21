using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireProgramOfStudyCategory
    {
        public int Id { get; set; }
        public int ProgramId { get; set; }
        public int CategoryId { get; set; }

        public virtual LookupProgramOfStudyCategory Category { get; set; }
        public virtual QuestionnaireProgramOfStudy Program { get; set; }
    }
}
