using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class LineOfCreditContext :DbContext{
        public DbSet<LineOfCredit> LinesOfCredit{get;set;}
        public DbSet<Client> Clients{get;set;}
        public DbSet<Creditor> Creditors{get;set;}
        
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite("Data Source=linesofcredit.db");
    }
}