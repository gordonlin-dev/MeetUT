using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class QuestionnaireLanguage
    {
        public QuestionnaireLanguage()
        {
            UserLanguages = new HashSet<UserLanguage>();
        }

        public int Id { get; set; }
        public string Value { get; set; }

        public virtual ICollection<UserLanguage> UserLanguages { get; set; }
    }
}
