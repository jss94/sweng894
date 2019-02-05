using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class VerboseError
    {
        public string source { get; set; }
        public string errorMessage { get; set; }
        public string innerException { get; set; }
        public string stackTrace { get; set; }
        public DateTime date { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
