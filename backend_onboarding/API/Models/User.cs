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
            UserCountries = new HashSet<UserCountry>();
            UserDemographics = new HashSet<UserDemographic>();
            UserHobbies = new HashSet<UserHobby>();
            UserIndustryExperiences = new HashSet<UserIndustryExperience>();
            UserLanguages = new HashSet<UserLanguage>();
            UserProgramOfStudies = new HashSet<UserProgramOfStudy>();
            UserProjectInterests = new HashSet<UserProjectInterest>();
            UserReasonsToJoins = new HashSet<UserReasonsToJoin>();
            UserReligions = new HashSet<UserReligion>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Description { get; set; }
        public int? YearOfStudy { get; set; }
        public int? College { get; set; }
        public int? DegreeType { get; set; }
        public bool CompletedOnboarding { get; set; }
        public int? Avatar { get; set; }

        public virtual ICollection<UserCompatability> UserCompatabilityUser1s { get; set; }
        public virtual ICollection<UserCompatability> UserCompatabilityUser2s { get; set; }
        public virtual ICollection<UserCountry> UserCountries { get; set; }
        public virtual ICollection<UserDemographic> UserDemographics { get; set; }
        public virtual ICollection<UserHobby> UserHobbies { get; set; }
        public virtual ICollection<UserIndustryExperience> UserIndustryExperiences { get; set; }
        public virtual ICollection<UserLanguage> UserLanguages { get; set; }
        public virtual ICollection<UserProgramOfStudy> UserProgramOfStudies { get; set; }
        public virtual ICollection<UserProjectInterest> UserProjectInterests { get; set; }
        public virtual ICollection<UserReasonsToJoin> UserReasonsToJoins { get; set; }
        public virtual ICollection<UserReligion> UserReligions { get; set; }
    }
}
