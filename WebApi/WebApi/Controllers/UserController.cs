
using System.Net;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using Dal.Core;
using Dal.Core.Queries;
using Microsoft.AspNetCore.Mvc;
using Negocio;
using Negocio.Core;
using Negocio.Entities;
using WebApi.Core.Handlers;
using WebApi.Core.Logging;
using WebApi.Handlers;
using WebApi.Model;
using WebApi.Services;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebApi.Controllers
{

  public class UserController : HttpHandler
  {

    private IDbContextBuilder _dbContextBuilder;

    public UserController(HttpContext context, IDbContextBuilder dbContextBuilder) : base(context)
    {
      _dbContextBuilder = dbContextBuilder;
      _logger = AppLogging.CreateLogger("WebApi.Controllers.UserController");
    }

    public override Task ProcessRequest() => throw new NotImplementedException();

    public Usuarios GetUsers()
    {
      Log("UserController.GetUsers");
      System.Threading.Thread.Sleep(2000);
      return new Usuarios().Load();
    }

    public Usuario GetUser(int id)
    {
      Log("UserController.GetUser");
      return new Usuario().Load(id);
    }

    public Usuario Insert(string nif, string nombre, string descripcion)
    {
      Log("UserController.Insert");
      using (var ctx = _dbContextBuilder.Build())
      {
        return new Usuario()
        {
          DataContext = ctx,
          Id = 0,
          Nif = nif,
          Nombre = nombre,
          Descripcion = descripcion
        }.Save();
      }
    }

    public string Delete(int id)
    {
      Log("UserController.Delete");
      using (var ctx = _dbContextBuilder.Build())
      {
        var user = new Usuario()
        {
          DataContext = ctx,
          Id = id
        };
        user.Delete();
        return "";
      }
    }

    public Usuario Update(int id, string nif, string nombre, string descripcion)
    {
      Log("UserController.Update");
      using (var ctx = _dbContextBuilder.Build())
      {
        var user = new Usuario(ctx);
        user.Id = id;
        user.Nif = nif;
        user.Nombre = nombre;
        user.Descripcion = descripcion;
        return user.Save();
      }
    }

    public static Usuario UpdateDelegate([FromRoute] int id,
                                         HttpContext context,
                                         [FromServices] IDbContextBuilder db,
                                         [FromBody] Usuario user,
                                         [FromHeader(Name = "Content-Type")] string contentType,
                                         //[FromQuery(Name = "guid")] int @guid,
                                         ClaimsPrincipal principal)
    {
      return new UserController(context, db).Update(id, user.Nif, user.Nombre, user.Descripcion);
    }

    public static Usuario InsertDelegate(HttpContext context,
                                         [FromServices] IDbContextBuilder db,
                                         [FromBody] Usuario user,
                                         [FromHeader(Name = "Content-Type")] string contentType,
                                         ClaimsPrincipal principal)
    {
      return new UserController(context, db).Insert(user.Nif, user.Nombre, user.Descripcion);
    }

    public static string DeleteDelegate([FromRoute] int id,
                                         HttpContext context,
                                         [FromServices] IDbContextBuilder db,
                                         [FromHeader(Name = "Content-Type")] string contentType,
                                         ClaimsPrincipal principal)
    {
      return new UserController(context, db).Delete(id);
    }



  }

  public static class EndpointRouteBuilderExtensions
  {

    public static IEndpointRouteBuilder MapUsersEndpoins(this IEndpointRouteBuilder endpoints)
    {
      // ===================================================================================================================
      // User Endpoints (Modo -> ashx/users?action=xxx)
      // ===================================================================================================================
      endpoints.MapGet("/ashx/users", async (c) => { await new UsersHttpHandler(c).ProcessRequest(); });
      endpoints.MapPost("/ashx/users", async (c) => { await new UsersHttpHandler(c).ProcessRequest(); });
      endpoints.MapPut("/ashx/users", async (c) => { await new UsersHttpHandler(c).ProcessRequest(); });
      endpoints.MapDelete("/ashx/users", async (c) => { await new UsersHttpHandler(c).ProcessRequest(); });
      // ===================================================================================================================
      // User Endpoints (Modo -> UserController)
      // ===================================================================================================================
      endpoints.MapGet("/users", (HttpContext context, IDbContextBuilder db) => new UserController(context, db).GetUsers());
      endpoints.MapGet("/users/{id}", (HttpContext context, int id, IDbContextBuilder db) => new UserController(context, db).GetUser(id));
      // ==========================================================================================
      // User Endpoints (Modo -> UserController) POST, PUT, DELETE
      // ==========================================================================================
      endpoints.MapPost("users", UserController.InsertDelegate);
      endpoints.MapPut("users/{id}", UserController.UpdateDelegate);
      endpoints.MapDelete("users/{id}", UserController.DeleteDelegate);

      return endpoints;
    }

  }

}
