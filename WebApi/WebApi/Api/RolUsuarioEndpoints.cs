
namespace Api.Endpoints {

  using Dal.Core;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities;

  public static class RolUsuarioEndpoints {

    public static void MapRolUsuarioEndpoints(this IEndpointRouteBuilder app) {
      var group = app.MapGroup("/api/roles-usuario").WithTags("RolesUsuario");

      // GET ALL
      group.MapGet("/", () => {
        var lista = new RolesUsuario();
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id) => {
        var item = new RolUsuario().Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (RolUsuario rolUsuario) => {
        var item = new RolUsuario() {
          Codigo = rolUsuario.Codigo,
          Descripcion = rolUsuario.Descripcion,
          NivelPermiso = rolUsuario.NivelPermiso
        };
        item.Save();
        return Results.Created($"/api/roles-usuario/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, RolUsuario rolUsuario) => {
        var item = new RolUsuario().Load(id);
        if (item == null) return Results.NotFound();
        item.Codigo = rolUsuario.Codigo;
        item.Descripcion = rolUsuario.Descripcion;
        item.NivelPermiso = rolUsuario.NivelPermiso;
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id) => {
        var item = new RolUsuario().Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}
