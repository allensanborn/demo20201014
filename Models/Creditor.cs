using System.Collections.Generic;

namespace Models
{

    public class Creditor{
        public int CreditorId{get;set;}
        public string Name{get;set; }
        public List<Client> Clients{get;} = new List<Client>();
    }
}