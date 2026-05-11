using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Negocio.Core;
using Negocio.Entities;
using WebApi.Model;
using WebApi.Services;
using System;

namespace WebApi.Controllers
{

  [Route("api/[controller]")]
  public class DistribuidoresController : BaseApiController
  {
    public DistribuidoresController(IDbContextBuilder dbContextBuilder) : base(dbContextBuilder) { }

    [HttpPost("validate")]
    public ActionResult<ApiResponse<object?>> ValidateDistribuidor([FromBody] Usuario usuario)
    {
      try
      {
        if (usuario.Nif == "")
        {
          Actions.Add(ErrorAction("El NIF es inválido."));
          Actions.Add(FocusAction("[name=nif]"));
          return ErrorResponse<object?>(null, Actions);
        }
        if (usuario.Nombre == "error")
          throw new Exception("El nombre 'error' ya existe en la base de datos");

        var query = string.Format("SELECT * FROM dbo.Distribuidor WHERE Id = {0}", usuario.Id);
        var response = SqlDirectQuery.LoadFromQuery(query)[0];
        return OkResponse(response, Actions);
      }
      catch (Exception ex)
      {
        Actions.Clear();
        Actions.Add(ExceptionMessageAction(ex, "ReactApp - ValidateDistribuidor"));
        return ErrorResponse<object?>(null, Actions);
      }
    }

    [HttpGet("test-actions")]
    public ActionResult<ApiResponse<object?>> TestServerActions()
    {
      Actions.Clear();
      var rnd = new Random();

      // Acciones disponibles
      var posiblesAcciones = new List<Func<ServerAction>>
      {
                () => ErrorAction("Esto es un error aleatorio."),
                () => AlertAction("¡Alerta generada desde el servidor!"),
                () => NavigateAction("/distribuidores"),
                () => FocusAction("#input-random"),
                () => PublishAction("app-show-notification", new { 
                  message = "Error en el servidor!!",
                  type = "error"
                }),
                () => SuccessAction("Operación completada correctamente."),
                () => ReloadAction(),
      };

      // Elegir aleatoriamente cuántas acciones devolver (1 a 3)
      int cantidad = rnd.Next(1, 4);
      var indices = Enumerable.Range(0, posiblesAcciones.Count).OrderBy(_ => rnd.Next()).Take(cantidad);

      foreach (var idx in indices)
        Actions.Add(posiblesAcciones[idx]());

      return OkResponse<object?>(new { mensaje = "Acciones generadas aleatoriamente", cantidad }, Actions);
    }

    // --- NUEVAS ACCIONES ÚTILES ---
    protected ServerAction SuccessAction(string message)
    {
      return new ServerAction("success", message);
    }

    protected ServerAction ReloadAction()
    {
      return new ServerAction("reload", null);
    }
  }
}
