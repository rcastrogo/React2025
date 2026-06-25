
namespace Api.Endpoints {

  using Dal.Core;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities;

  public static class CategoriaEndpoints {

    public static void MapCategoriaEndpoints(this IEndpointRouteBuilder app) {
      var group = app.MapGroup("/api/categorias").WithTags("Categorias");

      // GET ALL
      group.MapGet("/", () => {
        var lista = new Categorias();
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id) => {
        var item = new Categoria().Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (Categoria categoria) => {
        var item = new Categoria() {
          Codigo = categoria.Codigo,
          Descripcion = categoria.Descripcion,
          Orden = categoria.Orden
        };
        item.Save();
        return Results.Created($"/api/categorias/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, Categoria categoria) => {
        var item = new Categoria().Load(id);
        if (item == null) return Results.NotFound();
        item.Codigo = categoria.Codigo;
        item.Descripcion = categoria.Descripcion;
        item.Orden = categoria.Orden;
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id) => {
        var item = new Categoria().Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}