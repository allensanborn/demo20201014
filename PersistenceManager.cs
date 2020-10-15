using Breeze.Persistence.EFCore;
using Models;

public class PersistenceManager: EFPersistenceManager<LineOfCreditContext>{

    public PersistenceManager(LineOfCreditContext dbContext) : base(dbContext) {


    }
    
}