using System.Net.Mime;
using WebApi.Controllers;
using WebApi.Core.Logging;
using WebApi.Model;
using WebApi.Services;

namespace WebApi.Handlers
{

  public class TestHttpHandler : Core.Handlers.HttpHandler
  {

    #region Constructor

    public TestHttpHandler(HttpContext httpContext) : base(httpContext) { }

    #endregion

    public override async Task ProcessRequest()
    {
      
      Func<HttpContext, Object> __proc = GetItem("action").ToLower()
        switch {
          "users.all" => (context) => "users.all",
          "users" => (context) => new UserController(context, HttpContext.RequestServices.GetService<IDbContextBuilder>()).GetUsers(),
          "users.item" => (context) => new Address("Carretera", Convert.ToInt32("48").ToString()),
          "users.one" => __handleActionOne,
          _ => (context) => "Invalid action"
        };

      try
      {

        if (__proc is null) {
          HttpContext.Response.Redirect("index.html");
          return;
        }
       
        var __result = __proc.Invoke(HttpContext);
        HttpContext.Response.ContentType = MediaTypeNames.Application.Json; 
        HttpContext.Response.StatusCode = StatusCodes.Status200OK;
        await HttpContext.Response.WriteAsJsonAsync(__result);

    }
      catch (Exception ex)
      {
        Log(ex.Message);
        HttpContext.Response.ContentType = "application/json;charset=utf-8";
      }
}

    private User __handleActionOne(HttpContext httpContext)
    {

      Log("__handleActionOne");

      Microsoft.Extensions.Logging.ILogger logger = AppLogging.CreateLogger("WebApi.Handlers.TestHttpHandler");
      logger.LogInformation("LogInformation");
      logger.LogError("LogDebug");
      logger.LogWarning("LogTrace");

      return new User() { Id = 3344, Name = "__handleActionOne" };
    }

  }

}