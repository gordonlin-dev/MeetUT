using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserProgramOfStudy
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProgramId { get; set; }

        public virtual QuestionnaireProgramOfStudy Program { get; set; }
        public virtual User User { get; set; }
    }
}
