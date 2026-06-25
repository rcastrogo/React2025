
namespace Api.Endpoints {

  using Dal.Core;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities;

  public static class TipoDeDocumentoEndpoints {

    public static void MapTipoDeDocumentoEndpoints(this IEndpointRouteBuilder app) {
      var group = app.MapGroup("/api/tipos-documento").WithTags("TiposDeDocumento");

      // GET ALL
      group.MapGet("/", () => {
        var lista = new TiposDeDocumento();
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id) => {
        var item = new TipoDeDocumento().Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (TipoDeDocumento tipoDeDocumento) => {
        var item = new TipoDeDocumento() {
          Codigo = tipoDeDocumento.Codigo,
          Descripcion = tipoDeDocumento.Descripcion,
          Activo = tipoDeDocumento.Activo
        };
        item.Save();
        return Results.Created($"/api/tipos-documento/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, TipoDeDocumento tipoDeDocumento) => {
        var item = new TipoDeDocumento().Load(id);
        if (item == null) return Results.NotFound();
        item.Codigo = tipoDeDocumento.Codigo;
        item.Descripcion = tipoDeDocumento.Descripcion;
        item.Activo = tipoDeDocumento.Activo;
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id) => {
        var item = new TipoDeDocumento().Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}
