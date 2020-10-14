using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Client{
        public int ClientId{get;set;}
        
        [Required]
        [MaxLength(100)]
        public string FirstName{get;set;}
        
        [Required]
        [MaxLength(100)]
        public string LastName{get;set;}
        
        [Timestamp]
        public byte[] Timestamp{get;set;}
    }
}