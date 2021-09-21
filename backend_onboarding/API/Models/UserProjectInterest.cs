using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserProjectInterest
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProjectInterestId { get; set; }

        public virtual QuestionnaireProjectInterest ProjectInterest { get; set; }
        public virtual User User { get; set; }
    }
}
