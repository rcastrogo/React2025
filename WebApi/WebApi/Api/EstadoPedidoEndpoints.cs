
namespace Api.Endpoints {

  using Dal.Core;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities;

  public static class EstadoPedidoEndpoints {

    public static void MapEstadoPedidoEndpoints(this IEndpointRouteBuilder app) {
      var group = app.MapGroup("/api/estados-pedidos").WithTags("EstadosPedidos");

      // GET ALL
      group.MapGet("/", () => {
        var lista = new EstadosPedidos();
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id) => {
        var item = new EstadoPedido().Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (EstadoPedido estadoPedido) => {
        var item = new EstadoPedido() {
          Codigo = estadoPedido.Codigo,
          Descripcion = estadoPedido.Descripcion
        };
        item.Save();
        return Results.Created($"/api/estados-pedidos/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, EstadoPedido estadoPedido) => {
        var item = new EstadoPedido().Load(id);
        if (item == null) return Results.NotFound();
        item.Codigo = estadoPedido.Codigo;
        item.Descripcion = estadoPedido.Descripcion;
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id) => {
        var item = new EstadoPedido().Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}
