
using System.Data;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using source.Database;

namespace source.Models
{

    public class Vendor
    {
        public string guid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }
}