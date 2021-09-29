using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserReasonsToJoin
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ReasonId { get; set; }

        public virtual QuestionnaireReasonsToJoin Reason { get; set; }
        public virtual User User { get; set; }
    }
}
