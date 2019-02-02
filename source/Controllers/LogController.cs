using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace source.Controllers
{

    public class LoggerAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            Console.WriteLine(context.HttpContext.ToString());
            Console.WriteLine(context.Controller.ToString());
            Console.WriteLine(context.HttpContext.User.Claims);
        }
    }
}
