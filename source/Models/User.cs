
using System;
using System.Data;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using source.Database;

namespace source.Models
{
    public class User
    {
        public string userName { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string addressId { get; set; }
        public string role { get; set; }
    }
}