using System.Net.Mime;
using Dal.Core.Connections;
using Negocio;
using Negocio.Entities;
using WebApi.Controllers;
using WebApi.Core.Logging;
using WebApi.Model;
using WebApi.Services;

namespace WebApi.Handlers
{

  public class UsersHttpHandler : Core.Handlers.HttpHandler
  {

    #region Constructor

    public UsersHttpHandler(HttpContext httpContext) : base(httpContext) { }

    #endregion

    public override async Task ProcessRequest()
    {
      // ===================================================================
      // Mapear acciones (action=xxxx)
      // ===================================================================
      Func<HttpContext, Object> __proc = GetItem("action") switch
      {
        "getItems" => _getUsers,
        "getItem" => _getUserById,
        "getItemById" => _getUserById,
        "delete" => _deleteUser,
        "deleteItems" => _deleteUsers,
        "changeNames" => _changeNames,
        "new" => _newUserAsync,
        "save" => _updateUserAsync,
        _ => (context) => "Invalid action"
      };
      // ===================================================================
      // Ejecutar la acción
      // ===================================================================
      try
      {
        if (__proc is null)
        {
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

    private Usuarios _getUsers(HttpContext httpContext)
    {
      System.Threading.Thread.Sleep(2000);
      return new Usuarios().Load();
    }

    private Usuario _getUserById(HttpContext httpContext)
    {
      var id = ParseInteger("id", 0);
      return new Usuario().Load(id);
    }

    private string _deleteUser(HttpContext httpContext)
    {
      System.Threading.Thread.Sleep(2000);
      new Usuario().Load(ParseInteger("id", 0)).Delete();
      return "ok";
    }

    private string _deleteUsers(HttpContext httpContext)
    {
      System.Threading.Thread.Sleep(2000);
      var ids = GetItem("ids", "").Split(",".ToCharArray())
                                  .Select(i => Convert.ToInt32(i));
      using (var ctx = ConnectionManager.CreateDbContext())
      {
        foreach (var id in ids)
        {
          var user = new Usuario(ctx);
          user.Load(id);
          user.Delete();
        }
      }
      return "ok";
    }

    private Usuarios _changeNames(HttpContext httpContext)
    {
      System.Threading.Thread.Sleep(2000);
      var ids = GetItem("ids", "").Split(",".ToCharArray())
                                  .Select(i => Convert.ToInt32(i));
      var usuarios = new Usuarios();
      using (var ctx = ConnectionManager.CreateDbContext())
      {
        foreach (var id in ids)
        {
          var user = new Usuario(ctx);
          user.Load(id);
          user.Nombre += " a";
          user.Save();
          usuarios.Add(user);
        }
      }
      return usuarios;
    }

    private async Task<Usuario> _newUserAsync(HttpContext httpContext)
    {
      if (httpContext.Request.Method == "POST")
      {
        var body = await GetBodyAsync();
        var user = body.FromJsonTo<Usuario>();
        user.Id = 0;
        return user.Save().Load();
      }
      return new Usuario()
      {
        Nombre = GetItem("nombre", "Username"),
        Descripcion = GetItem("descripcion", "Descripcion"),
        Nif = GetItem("nif", "000000J")
      }.Save();
    }

    private async Task<Usuario> _updateUserAsync(HttpContext httpContext)
    {
      var id = ParseInteger("id", 0);
      if (httpContext.Request.Method == "PUT")
      {
        var body = await GetBodyAsync();
        var user = body.FromJsonTo<Usuario>();
        return user.Save();
      }
      return new Usuario()
      {
        Id = id,
        Nombre = GetItem("nombre", "Username"),
        Descripcion = GetItem("descripcion", "Descripcion"),
        Nif = GetItem("nif", "000000J")
      }.Save();
    }

  }

}