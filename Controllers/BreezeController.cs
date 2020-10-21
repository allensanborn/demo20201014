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

    [HttpPost]
    public async Task<bool> LoadSeedData()
    {
        var importer = new ImportData();
        var records = await importer.Get();

        if (!persistenceManager.Context.LinesOfCredit.Any())
        {
            var clients = persistenceManager.Context.Clients;
            persistenceManager.Context.RemoveRange(clients);
            var creditors = persistenceManager.Context.Creditors;
            persistenceManager.Context.RemoveRange(creditors);

            var creditorsFromJson = records.GroupBy(record => record.creditorName)
                   .Select(grp => new Creditor { Name = grp.First().creditorName })
                   .ToList();
            var clientsFromJson = records.GroupBy(record => new { record.firstName, record.lastName })
                               .Select(grp => new Client { FirstName = grp.First().firstName, LastName = grp.First().lastName })
                               .ToList();

            persistenceManager.Context.Creditors.AddRange(creditorsFromJson);
            persistenceManager.Context.Clients.AddRange(clientsFromJson);
            persistenceManager.Context.SaveChanges();


            foreach (var record in records)
            {
                var loc = new LineOfCredit();
                loc.Balance = (decimal)record.balance;
                loc.MinPaymentPercentage = (decimal)record.minPaymentPercentage;
                loc.ClientId = persistenceManager.Context.Clients
                .Where(client => client.FirstName == record.firstName && client.LastName == record.lastName)
                .Select(client => client.ClientId)
                .First();
                loc.CreditorId = persistenceManager.Context.Creditors
                .Where(creditor=>creditor.Name == record.creditorName)
                .Select(creditor=>creditor.CreditorId)
                .First();
                persistenceManager.Context.LinesOfCredit.Add(loc);
            }
            persistenceManager.Context.SaveChanges();

        }
        return true;
    }
}