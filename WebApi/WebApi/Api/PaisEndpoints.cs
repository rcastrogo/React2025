
namespace Api.Endpoints {

  using Dal.Core;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities;

  public static class PaisEndpoints {

    public static void MapPaisEndpoints(this IEndpointRouteBuilder app) {
      var group = app.MapGroup("/api/paises").WithTags("Paises");

      // GET ALL
      group.MapGet("/", () => {
        var lista = new Paises();
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id) => {
        var item = new Pais().Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (Pais pais) => {
        var item = new Pais() {
          Codigo = pais.Codigo,
          Descripcion = pais.Descripcion,
          PrefijoTelefonico = pais.PrefijoTelefonico
        };
        item.Save();
        return Results.Created($"/api/paises/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, Pais pais) => {
        var item = new Pais().Load(id);
        if (item == null) return Results.NotFound();
        item.Codigo = pais.Codigo;
        item.Descripcion = pais.Descripcion;
        item.PrefijoTelefonico = pais.PrefijoTelefonico;
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id) => {
        var item = new Pais().Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}
