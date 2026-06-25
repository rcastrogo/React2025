
namespace Api.Endpoints {

  using Dal.Core;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities;

  public static class DepartamentoEndpoints {

    public static void MapDepartamentoEndpoints(this IEndpointRouteBuilder app) {
      var group = app.MapGroup("/api/departamentos").WithTags("Departamentos");

      // GET ALL
      group.MapGet("/", () => {
        var lista = new Departamentos();
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id) => {
        var item = new Departamento().Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (Departamento departamento) => {
        var item = new Departamento() {
          Codigo = departamento.Codigo,
          Descripcion = departamento.Descripcion
        };
        item.Save();
        return Results.Created($"/api/departamentos/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, Departamento departamento) => {
        var item = new Departamento().Load(id);
        if (item == null) return Results.NotFound();
        item.Codigo = departamento.Codigo;
        item.Descripcion = departamento.Descripcion;
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id) => {
        var item = new Departamento().Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}
