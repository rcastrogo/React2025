
namespace Dal.Core.Connections.Configuration;

/// <summary>
/// Clase que contiene información sobre un origen de datos.
/// </summary>
public class DataSource {

  /// <summary>
  /// Tipo del origen de datos. Por ejemplo "SqlServer", "Sqlite", "Oracle".
  /// Se utiliza para resolver y obtener el <see cref="IConnectionBuilder"/> correspondiente.
  /// </summary>
  public string Type{ get; set; }

  /// <summary>
  /// Cadena de conexión para acceder a la base de datos.
  /// </summary>
  public string Value{ get; set; }

}

