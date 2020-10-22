using System;
using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class LineOfCreditContext : DbContext{

        public LineOfCreditContext()
        {
        }

        public LineOfCreditContext(DbContextOptions<LineOfCreditContext> options)
            : base(options)
        {
        }

        public DbSet<LineOfCredit> LineOfCredit{get;set;}
        public DbSet<Client> Client{get;set;}
        public DbSet<Creditor> Creditor{get;set;}
        
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite("Data Source=linesofcredit.db");
    }
}