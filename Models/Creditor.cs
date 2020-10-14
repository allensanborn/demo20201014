using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace Models
{

    public class Creditor{
        public int CreditorId{get;set;}

        [Required]
        [MaxLength(100)]
        public string Name{get;set; }
        public List<Client> Clients{get;} = new List<Client>();


        [Timestamp]
        public byte[] Timestamp{get;set;}
    }
}