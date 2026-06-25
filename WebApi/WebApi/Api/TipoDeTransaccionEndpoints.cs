
namespace Api.Endpoints {

  using Dal.Core;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities;

  public static class TipoDeTransaccionEndpoints {

    public static void MapTipoDeTransaccionEndpoints(this IEndpointRouteBuilder app) {
      var group = app.MapGroup("/api/tipos-transaccion").WithTags("TiposDeTransaccion");

      // GET ALL
      group.MapGet("/", () => {
        var lista = new TiposDeTransaccion();
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id) => {
        var item = new TipoDeTransaccion().Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (TipoDeTransaccion tipoDeTransaccion) => {
        var item = new TipoDeTransaccion() {
          Codigo = tipoDeTransaccion.Codigo,
          Descripcion = tipoDeTransaccion.Descripcion,
          Naturaleza = tipoDeTransaccion.Naturaleza
        };
        item.Save();
        return Results.Created($"/api/tipos-transaccion/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, TipoDeTransaccion tipoDeTransaccion) => {
        var item = new TipoDeTransaccion().Load(id);
        if (item == null) return Results.NotFound();
        item.Codigo = tipoDeTransaccion.Codigo;
        item.Descripcion = tipoDeTransaccion.Descripcion;
        item.Naturaleza = tipoDeTransaccion.Naturaleza;
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id) => {
        var item = new TipoDeTransaccion().Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}
