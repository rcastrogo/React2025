
namespace Dal.Core.Connections;

using System.Data;

/// <summary>
/// Operaciones de las clases que puedan crear conexiones con bases de datos.
/// </summary>
public interface IConnectionBuilder
{
  /// <summary>
  /// Crea una conexión con una base de datos utilizando una cadena de conexión.
  /// </summary>
  /// <param name="connectionString">Cadena de conexión con la base de datos.</param>
  /// <returns>
  /// </returns>
  IDbConnection CreateConnection(string connectionString);
}

