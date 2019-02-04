using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace source.Framework
{
    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app, ILogger logger)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";
                    
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        if (context.User.Claims.Count() > 0)
                        {
                            await logger.LogUnhandledException(context.User, contextFeature.Error);
                        }
                        else
                        {
                            await logger.LogUnhandledException(contextFeature.Error);
                        }
                        

                    #if DEBUG
                    await context.Response.WriteAsync(new VerboseError()
                    {
                         errorMessage = contextFeature.Error.Message,
                         innerException = contextFeature.Error.InnerException != null ? contextFeature.Error.InnerException.ToString() : String.Empty,
                         stackTrace = contextFeature.Error.StackTrace
                    }.ToString());

                     #else

                     await context.Response.WriteAsync(new VanillaError()
                     {
                         StatusCode = context.Response.StatusCode,
                         ErrorMessage = "An error has occured."
                     }.ToString());

                     #endif
                    }
                });
            });
        }
    }
}
