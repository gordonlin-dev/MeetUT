using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserLanguage
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int LanguageId { get; set; }

        public virtual QuestionnaireLanguage Language { get; set; }
        public virtual User User { get; set; }
    }
}
