using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireCountry
    {
        public QuestionnaireCountry()
        {
            UserCountries = new HashSet<UserCountry>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<UserCountry> UserCountries { get; set; }
    }
}
