namespace Models
{
    public class LineOfCredit{
        public int LineOfCreditId{get;set;}       
        public int ClientId{get;set;}
        public Client Client{get;set;}

        public int CreditorId{get;set;}
        public Creditor Creditor{get;set;}

    }
}