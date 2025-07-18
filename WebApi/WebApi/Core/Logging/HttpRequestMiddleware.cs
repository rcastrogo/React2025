using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Core.Logging
{

  public class HttpRequestMiddleware
  {
    private readonly RequestDelegate _next;

    public HttpRequestMiddleware(RequestDelegate next)
    {
      _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
      AppLogging.Log(
        string.Format("{0} {1}{2}", 
                      context.Request.Method,
                      System.Net.WebUtility.UrlDecode(context.Request.Path),
                      System.Net.WebUtility.UrlDecode(context.Request.QueryString.Value)));
      try{
        await _next.Invoke(context);
      } catch (Exception ex) {
        AppLogging.Log(ex.ToString());
      }
    }
  }

}
