using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserReligion
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Value { get; set; }

        public virtual User User { get; set; }
    }
}
