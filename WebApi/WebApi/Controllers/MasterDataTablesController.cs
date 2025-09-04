using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Negocio;
using Negocio.Core;
using Negocio.Entities;
using WebApi.Model;
using WebApi.Services;
namespace WebApi.Controllers;


[Route("api/[controller]")]
public class MasterDataTablesController : BaseApiController
{

  public MasterDataTablesController(IDbContextBuilder dbContextBuilder) : base(dbContextBuilder) { }

  [HttpGet("Departamentos")]
  public ActionResult<ApiResponse<Departamentos>> GetDepartamentos()
  {
    return OkResponse(new Departamentos().Load());
  }

  [HttpGet("Departamentos/{id}")]
  public ActionResult<ApiResponse<Departamento>> GetDepartamento(int id)
  {
    var target = new Departamento().Load(id);
    if (target.Id == 0)
    {
      Actions.Add(ErrorAction("No se ha encontrado el departamento"));
      return ErrorResponse(target, Actions);
    }
    return OkResponse(target);
  }

  [HttpGet("Categorias")]
  public ActionResult<ApiResponse<Categorias>> GetCategorias()
  {
    return OkResponse(new Categorias().Load());
  }

  [HttpGet("Categorias/{id}")]
  public ActionResult<ApiResponse<Categoria>> GetCategoria(int id)
  {
    var target = new Categoria().Load(id);
    if (target.Id == 0)
    {
      Actions.Add(ErrorAction("No se ha encontrado la categoría"));
      return ErrorResponse(target, Actions);
    }
    return OkResponse(target);
  }

  [HttpGet("EstadosPedidos")]
  public ActionResult<ApiResponse<EstadosPedidos>> GetEstadosPedidos()
  {
    return OkResponse(new EstadosPedidos().Load());
  }

  [HttpGet("EstadosPedidos/{id}")]
  public ActionResult<ApiResponse<EstadoPedido>> GetEstadosPedido(int id)
  {
    var target = new EstadoPedido().Load(id);
    if (target.Id == 0)
    {
      Actions.Add(ErrorAction("No se ha encontrado el estado"));
      return ErrorResponse(target, Actions);
    }
    return OkResponse(target);
  }

  [HttpGet("Monedas")]
  public ActionResult<ApiResponse<Monedas>> GetMonedas()
  {
    return OkResponse(new Monedas().Load());
  }

  [HttpGet("Monedas/{id}")]
  public ActionResult<ApiResponse<Moneda>> GetMoneda(int id)
  {
    var target = new Moneda().Load(id);
    if (target.Id == 0)
    {
      Actions.Add(ErrorAction("No se ha encontrado la moneda"));
      return ErrorResponse(target, Actions);
    }
    return OkResponse(target);
  }

  [HttpGet("Paises")]
  public ActionResult<ApiResponse<Paises>> GetPaises()
  {
    return OkResponse(new Paises().Load());
  }

  [HttpGet("Paises/{id}")]
  public ActionResult<ApiResponse<Pais>> GetPais(int id)
  {
    var target = new Pais().Load(id);
    if (target.Id == 0)
    {
      Actions.Add(ErrorAction("No se ha encontrado el país"));
      return ErrorResponse(target, Actions);
    }
    return OkResponse(target);
  }

  [HttpGet("RolesUsuario")]
  public ActionResult<ApiResponse<RolesUsuario>> GetRolesUsuario()
  {
    return OkResponse(new RolesUsuario().Load());
  }

  [HttpGet("RolesUsuario/{id}")]
  public ActionResult<ApiResponse<RolUsuario>> GetRolUsuario(int id)
  {
    var target = new RolUsuario().Load(id);
    if (target.Id == 0)
    {
      Actions.Add(ErrorAction("No se ha encontrado el rol"));
      return ErrorResponse(target, Actions);
    }
    return OkResponse(target);
  }

  [HttpGet("TiposDeDocumento")]
  public ActionResult<ApiResponse<TiposDeDocumento>> GetTiposDeDocumento()
  {
    return OkResponse(new TiposDeDocumento().Load());
  }

  [HttpGet("TiposDeDocumento/{id}")]
  public ActionResult<ApiResponse<TipoDeDocumento>> GetTipoDeDocumento(int id)
  {
    var target = new TipoDeDocumento().Load(id);
    if (target.Id == 0)
    {
      Actions.Add(ErrorAction("No se ha encontrado el tipo de documento"));
      return ErrorResponse(target, Actions);
    }
    return OkResponse(target);
  }

  [HttpGet("TiposDeTransaccion")]
  public ActionResult<ApiResponse<TiposDeTransaccion>> GetTiposDeTransaccion()
  {
    return OkResponse(new TiposDeTransaccion().Load());
  }

  [HttpGet("TiposDeTransaccion/{id}")]
  public ActionResult<ApiResponse<TipoDeTransaccion>> GetTipoDeTransaccion(int id)
  {
    var target = new TipoDeTransaccion().Load(id);
    if (target.Id == 0)
    {
      Actions.Add(ErrorAction("No se ha encontrado el tipo de transacción"));
      return ErrorResponse(target, Actions);
    }
    return OkResponse(target);
  }

  [HttpGet("serializers")]
  public ActionResult<ApiResponse<string>> TestSerializers()
  {
    try
    {
      var values = SerializersStringRepository
                    .GetNamedSerializer(
                        "TiposDeDocumento",
                        new TiposDeDocumento().Load()
                    )
                    .ToJsonString(true);
      return OkResponse(values);
    }
    catch (Exception ex)
    {
      Actions.Add(ErrorAction(ex.Message));
      Actions.Add(ErrorAction(ex.ToString()));
      return ErrorResponse("", Actions);
    }
  }

}
