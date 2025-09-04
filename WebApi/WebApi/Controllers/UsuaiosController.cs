using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Dal.Core;
using Negocio;
using Negocio.Entities;
using WebApi.Services;
using Negocio.Core;
using System.Linq;
using WebApi.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Azure;

namespace WebApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UsuariosController : ControllerBase
  {
    private readonly IDbContextBuilder _dbContextBuilder;

    public UsuariosController(IDbContextBuilder dbContextBuilder)
    {
      _dbContextBuilder = dbContextBuilder;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Usuario>> GetUsers()
    {
      var usuarios = new Usuarios().Load();
      return Ok(usuarios);
    }

    [HttpGet("{id}")]
    public ActionResult<Usuario> GetUser(int id)
    {
      var usuario = new Usuario().Load(id);
      if (usuario == null)
        return NotFound();
      return Ok(usuario);
    }

    [HttpPost]
    public ActionResult<Usuario> Insert([FromBody] Usuario user)
    {
      using var ctx = _dbContextBuilder.Build();
      var nuevoUsuario = new Usuario
      {
        DataContext = ctx,
        Id = 0,
        Nif = user.Nif,
        Nombre = user.Nombre,
        Descripcion = user.Descripcion
      }.Save();

      return CreatedAtAction(nameof(GetUser), new { id = nuevoUsuario.Id }, nuevoUsuario);
    }

    [HttpPut("{id}")]
    public ActionResult<Usuario> Update(int id, [FromBody] Usuario user)
    {
      using var ctx = _dbContextBuilder.Build();
      var updatedUser = new Usuario(ctx)
      {
        Id = id,
        Nif = user.Nif,
        Nombre = user.Nombre,
        Descripcion = user.Descripcion
      }.Save();

      return Ok(updatedUser);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
      using var ctx = _dbContextBuilder.Build();
      var user = new Usuario
      {
        DataContext = ctx,
        Id = id
      };
      user.Delete();
      return NoContent();
    }


    [HttpGet("tables/{tablename}")]
    public ActionResult GetTableRows(string tablename)
    {
      var query = string.Format("SELECT * FROM [{0}]", tablename);
      System.Threading.Thread.Sleep(500);
      var json = SqlDirectQuery.LoadFromQuery(query).ToJsonString();
      return Ok(json);
    }

    [HttpGet("distribuidores")]
    public ActionResult GetDistribuidores()
    {
      var query = "SELECT * FROM [Distribuidor]";
      System.Threading.Thread.Sleep(500);
      var json = SqlDirectQuery.LoadFromQuery(query).ToJsonString();
      return Ok(json);
    }

    [HttpGet("distribuidores/by/{term}")]
    public ActionResult GetDistribuidoresByTerm(string term)
    {
      var query = string.Format(@"
        SELECT * FROM dbo.Distribuidor D 
        WHERE D.Nif LIKE '%{0}%' or 
              D.Nombre LIKE '%{0}%' or
	            D.Email LIKE '%{0}%' or 
              D.Direccion LIKE '%{0}%' ",
      term);
      System.Threading.Thread.Sleep(500);
      var json = SqlDirectQuery.LoadFromQuery(query).ToJsonString();
      return Ok(json);
    }

    [HttpGet("distribuidores/{id}")]
    public ActionResult GetDistribuidoresById(int id)
    {
      var query = string.Format("SELECT * FROM dbo.Distribuidor WHERE Id = {0}", id);
      System.Threading.Thread.Sleep(500);
      var json = SqlDirectQuery.LoadFromQuery(query).ToJsonString();
      return Ok(json);
    }

    [HttpGet("roles/distribuidor/{id}")]
    public ActionResult GetRolesDistribuidor(int id)
    {
      var query = string.Format("SELECT * FROM dbo.RolDistribuidor WHERE DistribuidorId={0} ORDER BY DistribuidorId", id);
      System.Threading.Thread.Sleep(500);
      var json = SqlDirectQuery.LoadFromQuery(query).ToJsonString();
      return Ok(json);
    }
  }
}
