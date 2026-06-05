using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Negocio.Core;
using Negocio.Entities;

namespace WebApi.Pages;

public class DistribuidoresModel : PageModel
{
  public System.Collections.IList Distribuidores { get; set; } = new List<object>();

  public void OnGet()
  {
    var query = "SELECT * FROM [Distribuidor]";
    Distribuidores = SqlDirectQuery.LoadFromQuery(query);
  }

  public IActionResult OnGetUsuarios()
  {
    return new JsonResult(new Usuarios().Load());
  }

  // --- Tablas Maestras ---

  public IActionResult OnGetDepartamentos()
  {
    return new JsonResult(new Departamentos().Load());
  }

  public IActionResult OnGetDepartamento(int id)
  {
    return new JsonResult(new Departamento().Load(id));
  }

  public IActionResult OnGetCategorias()
  {
    return new JsonResult(new Categorias().Load());
  }

  public IActionResult OnGetCategoria(int id)
  {
    return new JsonResult(new Categoria().Load(id));
  }

  public IActionResult OnGetEstadosPedidos()
  {
    return new JsonResult(new EstadosPedidos().Load());
  }

  public IActionResult OnGetEstadoPedido(int id)
  {
    return new JsonResult(new EstadoPedido().Load(id));
  }

  public IActionResult OnGetMonedas()
  {
    return new JsonResult(new Monedas().Load());
  }

  public IActionResult OnGetMoneda(int id)
  {
    return new JsonResult(new Moneda().Load(id));
  }

  public IActionResult OnGetPaises()
  {
    return new JsonResult(new Paises().Load());
  }

  public IActionResult OnGetPais(int id)
  {
    return new JsonResult(new Pais().Load(id));
  }

  public IActionResult OnGetRolesUsuario()
  {
    return new JsonResult(new RolesUsuario().Load());
  }

  public IActionResult OnGetRolUsuario(int id)
  {
    return new JsonResult(new RolUsuario().Load(id));
  }

  public IActionResult OnGetTiposDeDocumento()
  {
    return new JsonResult(new TiposDeDocumento().Load());
  }

  public IActionResult OnGetTipoDeDocumento(int id)
  {
    return new JsonResult(new TipoDeDocumento().Load(id));
  }

  public IActionResult OnGetTiposDeTransaccion()
  {
    return new JsonResult(new TiposDeTransaccion().Load());
  }

  public IActionResult OnGetTipoDeTransaccion(int id)
  {
    return new JsonResult(new TipoDeTransaccion().Load(id));
  }
}