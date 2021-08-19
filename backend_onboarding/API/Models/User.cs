using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class User
    {
        public User()
        {
            UserHobbies = new HashSet<UserHobby>();
            UserProgramOfStudies = new HashSet<UserProgramOfStudy>();
        }

        public int Id { get; set; }
        public string Email { get; set; }

        public virtual ICollection<UserHobby> UserHobbies { get; set; }
        public virtual ICollection<UserProgramOfStudy> UserProgramOfStudies { get; set; }
    }
}
