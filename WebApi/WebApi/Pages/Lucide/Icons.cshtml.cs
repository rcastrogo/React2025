using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using Negocio.Core;
using Negocio.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebApi.Pages;

public class IconsModel : PageModel
{
  private readonly IWebHostEnvironment _env;
  private readonly IMemoryCache _cache;

  public IconsModel(IWebHostEnvironment env, IMemoryCache cache)
  {
    _env = env;
    _cache = cache;
  }

  public IActionResult OnGet(string? name)
  {
    if (string.IsNullOrEmpty(name) || name.Contains("..")) return BadRequest();

    name = name.ToLower();
    string cacheKey = $"icon_{name}";
    if (!_cache.TryGetValue(cacheKey, out string? svgContenido) || svgContenido is null)
    {
      var rutaIcono = Path.Combine(_env.WebRootPath, "js", "icons", $"{name}.svg");

      if (!System.IO.File.Exists(rutaIcono)) return NotFound();
      svgContenido = System.IO.File.ReadAllText(rutaIcono);
      _cache.Set(cacheKey, svgContenido, new MemoryCacheEntryOptions
      {
        Priority = CacheItemPriority.NeverRemove // Al ser archivos estáticos, que no se borren de la RAM
      });
    }

    return Content(svgContenido, "image/svg+xml");
  }

  public IActionResult OnGetJsBundle()
  {
    var rutaCarpeta = Path.Combine(_env.WebRootPath, "js", "icons");
    if (!Directory.Exists(rutaCarpeta)) return NotFound();

    // 1. Definimos el catálogo exacto de iconos admitidos
    var iconosPermitidos = new HashSet<string>
        {
            "activity", "bar-chart", "chevron-down", "chevron-up", "success", "check",
            "question", "circle-x", "error", "warning", "code", "database", "globe",
            "info", "minus", "moon", "plus", "power", "radio", "share-2", "server",
            "settings", "sun", "timer", "trash", "tv", "text", "user", "users", "x",
            "zap", "rocket", "more-horizontal", "arrow-left", "chevron-left", "chevron-right",
            "chevrons-left", "chevrons-right", "refresh-ccw", "trash-2", "square-pen", "search",
            "menu", "book-open", "square-check", "square", "shuffle", "funnel", "clipboard",
            "copy", "file", "folder", "layers", "eye", "lock", "mail", "star", "heart",
            "download", "upload"
        };

    var archivos = Directory.GetFiles(rutaCarpeta, "*.svg");
    var sb = new StringBuilder();

    // 2. Lo asignamos a window para que esté accesible de manera global (JS estándar)
    sb.AppendLine("window.LucideIcons = {");

    foreach (var archivo in archivos)
    {
      var nombre = Path.GetFileNameWithoutExtension(archivo).ToLower();

      // 3. Si el archivo SVG de la carpeta no está en tu lista, lo ignoramos por completo
      if (!iconosPermitidos.Contains(nombre)) continue;

      var contenidoSvg = System.IO.File.ReadAllText(archivo)
          .Replace("\r", "").Replace("\n", "")  // Limpiar saltos de línea
          .Replace("\"", "\\\"");               // Escapar comillas dobles

      sb.AppendLine($"  \"{nombre}\": \"{contenidoSvg}\",");
    }

    sb.AppendLine("};");

    return Content(sb.ToString(), "application/javascript");
  }

}
