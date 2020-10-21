using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System;

namespace Models
{
    public class ImportData
    {
        public IEnumerable<Record> Records { get; private set; }

        public ImportData()
        {
        }

        public async Task<IEnumerable<Record>> Get()
        {
            var response = await GetExternalResponse();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var result =  JsonSerializer.Deserialize<IEnumerable<Record>>(response, options);
            return result;
        }

        private async Task<string> GetExternalResponse()
        {
            var client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync("https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json");
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

    }

    public class Record
    {
        public int Id { get; set; }
        public int CreditorName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public decimal MinPaymentPercentage { get; set; }
        public decimal Balance { get; set; }
    }
}
