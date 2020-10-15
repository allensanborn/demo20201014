using Breeze.AspNetCore;
using Breeze.Persistence;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Models;
using System.Linq;

[Route("api/[controller]/[action]")]
[BreezeQueryFilter]
public class BreezeController : Controller
{
    private PersistenceManager persistenceManager;
    public BreezeController(LineOfCreditContext dbContext)
    {
        persistenceManager = new PersistenceManager(dbContext);
    }

      [HttpGet]
  public IQueryable<Client> Clients()
  {
      return persistenceManager.Context.Clients;
  }
  [HttpGet]
  public IQueryable<Creditor> Creditors()
  {
      return persistenceManager.Context.Creditors;
  }
  [HttpGet]
  public IQueryable<LineOfCredit> LinesOfCredit()
  {
      return persistenceManager.Context.LinesOfCredit;
  }
  [HttpPost]
  public ActionResult<SaveResult> SaveChanges([FromBody] JObject saveBundle)
  {
      return persistenceManager.SaveChanges(saveBundle);
  }
}