
namespace Api.Endpoints
{

  using Dal.Core;
  using Microsoft.AspNetCore.Authorization;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities;

  public static class MonedaEndpoints
  {

    public static void MapSystemEndpoints(this IEndpointRouteBuilder app)
    {
      // Endpoint para listar todas las rutas disponibles
      app.MapGet("/api/system/routes", (EndpointDataSource endpointDataSource) =>
      {
        var rutas = endpointDataSource.Endpoints
            .Select(endpoint =>
            {
              // Intentamos castear a RouteEndpoint para obtener el patrón de la URL
              var routeEndpoint = endpoint as RouteEndpoint;

              // Extraemos los métodos HTTP (GET, POST, etc.) desde los metadatos
              var httpMethodMetadata = endpoint.Metadata.OfType<HttpMethodMetadata>().FirstOrDefault();
              var metodos = httpMethodMetadata?.HttpMethods ?? new[] { "ANY" };

              return new
              {
                Nombre = endpoint.DisplayName,
                Ruta = routeEndpoint?.RoutePattern.RawText ?? "/",
                Metodos = metodos,
                // Opcional: puedes ver si requiere autorización, políticas, etc.
                Anonimo = endpoint.Metadata.OfType<AllowAnonymousAttribute>().Any()
              };
            })
            // Opcional: Filtrar para no mostrar las rutas nativas de Swagger o este mismo endpoint
            .Where(r => !r.Ruta.Contains("swagger") && !r.Ruta.Contains("/api/system/routes"))
            .ToList();

        return Results.Ok(rutas);
      })
      .WithTags("System")
      .WithName("GetAvailableRoutes");
    }
    public static void MapMonedaEndpoints(this IEndpointRouteBuilder app)
    {
      var group = app.MapGroup("/api/monedas").WithTags("Monedas");

      // GET ALL
      group.MapGet("/", () =>
      {
        var lista = new Monedas();
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id) =>
      {
        var item = new Moneda().Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (Moneda moneda) =>
      {
        var item = new Moneda()
        {
          Codigo = moneda.Codigo,
          Descripcion = moneda.Descripcion,
          Simbolo = moneda.Simbolo
        };
        item.Save();
        return Results.Created($"/api/monedas/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, Moneda moneda) =>
      {
        var item = new Moneda().Load(id);
        if (item == null) return Results.NotFound();
        item.Codigo = moneda.Codigo;
        item.Descripcion = moneda.Descripcion;
        item.Simbolo = moneda.Simbolo;
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id) =>
      {
        var item = new Moneda().Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}
