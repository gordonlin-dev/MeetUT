using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserDemographic
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public virtual User User { get; set; }
    }
}
