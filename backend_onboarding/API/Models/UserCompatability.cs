using System;
using System.Collections.Generic;

#nullable disable

namespace API.Models
{
    public partial class UserCompatability
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public int User2Id { get; set; }
        public int CompatabilityScore { get; set; }

        public virtual User User1 { get; set; }
        public virtual User User2 { get; set; }
    }
}
