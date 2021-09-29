using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserCountry
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CountryId { get; set; }

        public virtual QuestionnaireCountry Country { get; set; }
        public virtual User User { get; set; }
    }
}
