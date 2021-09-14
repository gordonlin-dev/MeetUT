using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class User
    {
        public User()
        {
            UserCompatabilityUser1s = new HashSet<UserCompatability>();
            UserCompatabilityUser2s = new HashSet<UserCompatability>();
            UserDemographics = new HashSet<UserDemographic>();
            UserHobbies = new HashSet<UserHobby>();
            UserLanguages = new HashSet<UserLanguage>();
            UserProgramOfStudies = new HashSet<UserProgramOfStudy>();
            UserReligions = new HashSet<UserReligion>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Description { get; set; }

        public virtual ICollection<UserCompatability> UserCompatabilityUser1s { get; set; }
        public virtual ICollection<UserCompatability> UserCompatabilityUser2s { get; set; }
        public virtual ICollection<UserDemographic> UserDemographics { get; set; }
        public virtual ICollection<UserHobby> UserHobbies { get; set; }
        public virtual ICollection<UserLanguage> UserLanguages { get; set; }
        public virtual ICollection<UserProgramOfStudy> UserProgramOfStudies { get; set; }
        public virtual ICollection<UserReligion> UserReligions { get; set; }
    }
}
