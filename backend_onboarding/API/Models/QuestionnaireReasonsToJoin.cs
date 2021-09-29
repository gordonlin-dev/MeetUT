using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireReasonsToJoin
    {
        public QuestionnaireReasonsToJoin()
        {
            UserReasonsToJoins = new HashSet<UserReasonsToJoin>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<UserReasonsToJoin> UserReasonsToJoins { get; set; }
    }
}
