using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class LineOfCredit{
        public int LineOfCreditId{get;set;}       

        [Required]
        public int ClientId{get;set;}
        public Client Client{get;set;}

        [Required]
        public int CreditorId{get;set;}
        public Creditor Creditor{get;set;}

        //https://dzone.com/articles/how-to-store-money-in-sql-server
        public decimal Balance {get;set;}
        
        public decimal MinPaymentPercentage{get;set;}

        [Timestamp]
        public byte[] Timestamp{get;set;}

    }
}