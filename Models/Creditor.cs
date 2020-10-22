using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace Models
{

    public class Creditor
    {
        public Creditor()
        {
            LinesOfCredit = new HashSet<LineOfCredit>();
        }
        
        public int CreditorId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Timestamp]
        public byte[] Timestamp { get; set; }

        public virtual ICollection<LineOfCredit> LinesOfCredit { get; set; }
    }
}