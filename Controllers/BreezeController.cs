using Breeze.AspNetCore;
using Breeze.Persistence;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

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
        return persistenceManager.Context.Client;
    }
    [HttpGet]
    public IQueryable<Creditor> Creditors()
    {
        return persistenceManager.Context.Creditor;
    }
    [HttpGet]
    public IQueryable<LineOfCredit> LinesOfCredit()
    {
        return persistenceManager.Context.LineOfCredit;
    }
    [HttpPost]
    public ActionResult<SaveResult> SaveChanges([FromBody] JObject saveBundle)
    {
        return persistenceManager.SaveChanges(saveBundle);
    }

    [HttpPost]
    public async Task<bool> LoadSeedData()
    {
        var importer = new ImportData();
        var records = await importer.Get();

        var linesOfCredit = persistenceManager.Context.LineOfCredit;
        persistenceManager.Context.RemoveRange(linesOfCredit);

        var clients = persistenceManager.Context.Client;
        persistenceManager.Context.RemoveRange(clients);
        var creditors = persistenceManager.Context.Creditor;
        persistenceManager.Context.RemoveRange(creditors);

        var creditorsFromJson = records.GroupBy(record => record.creditorName)
               .Select(grp => new Creditor { Name = grp.First().creditorName })
               .ToList();
        var clientsFromJson = records.GroupBy(record => new { record.firstName, record.lastName })
                           .Select(grp => new Client { FirstName = grp.First().firstName, LastName = grp.First().lastName })
                           .ToList();

        persistenceManager.Context.Creditor.AddRange(creditorsFromJson);
        persistenceManager.Context.Client.AddRange(clientsFromJson);
        persistenceManager.Context.SaveChanges();


        foreach (var record in records)
        {
            var loc = new LineOfCredit();
            loc.Balance = (decimal)record.balance;
            loc.MinPaymentPercentage = (decimal)record.minPaymentPercentage;
            loc.ClientId = persistenceManager.Context.Client
            .Where(client => client.FirstName == record.firstName && client.LastName == record.lastName)
            .Select(client => client.ClientId)
            .First();
            loc.CreditorId = persistenceManager.Context.Creditor
            .Where(creditor => creditor.Name == record.creditorName)
            .Select(creditor => creditor.CreditorId)
            .First();
            persistenceManager.Context.LineOfCredit.Add(loc);
        }
        persistenceManager.Context.SaveChanges();


        return true;
    }
}