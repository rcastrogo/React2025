using Microsoft.AspNetCore.Mvc;
using Negocio.Core;
using Negocio.Entities;
using WebApi.Model;
using WebApi.Services;
namespace WebApi.Controllers;


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

}
