using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireProjectInterest
    {
        public QuestionnaireProjectInterest()
        {
            UserProjectInterests = new HashSet<UserProjectInterest>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<UserProjectInterest> UserProjectInterests { get; set; }
    }
}
