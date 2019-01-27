using System;
using source.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace source.Controllers
{
    [Route("api/[controller]")]
    public class VendorsController
    {
        private IVendorsQuery _query;

        public VendorsController(IVendorsQuery query)
        {
            _query = query;
        }

        // GET api/users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            throw new NotImplementedException();
        }

        // GET api/users
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            throw new NotImplementedException();
        }

        // GET api/users
        [HttpGet]
        public async Task<IActionResult> GetByName(string name)
        {
            throw new NotImplementedException();
        }
    }
}