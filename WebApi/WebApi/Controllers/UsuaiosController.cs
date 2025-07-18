using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Dal.Core;
using Negocio;
using Negocio.Entities;
using WebApi.Services;

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
  }
}
