
using System.Collections.Generic;
using Dal.Core.Connections.Configuration;
using Microsoft.Extensions.Configuration;


namespace Dal.Core.Connections
{

  /// <summary>
  /// 
  /// </summary>
  public sealed class ConnectionManager
  {

    /// <summary>
    /// Diccionario con los origenes de datos configurados.
    /// </summary>
    private static Dictionary<string, DataSource> _dataSources;


    /// <summary>
    /// Constructor privado de la clase.
    /// </summary>
    private ConnectionManager() { }

    /// <summary>
    /// Inicializa los origenes de datos desde la configuración de la aplicación.
    /// </summary>
    /// <param name="configuration"></param>
    public static void Configure(IConfigurationRoot configuration) {
      _dataSources = configuration.GetSection("DataBaseSettings")
                                  .Get<Configuration.DataBaseSettings>()
                                  .DataSources;
    }

    /// <summary>
    /// Obtiene un nuevo objeto <see cref="DbContext"/> a partir del nombre del origen de datos y le establece
    /// la cadena de conexión correspondiente.
    /// </summary>
    /// <param name="name">Nombre del origen de datos. Por defecto se utiliza "Default"</param>
    /// <returns></returns>
    /// <exception cref="System.Exception"></exception>
    public static DbContext CreateDbContext(string name="Default")
    {
      if (_dataSources.ContainsKey(name))
      {
        var __dataSource = _dataSources[name];
        var __builder = __getBuilderFromString(__dataSource.Type);
        return new DbContext(__builder.CreateConnection(__dataSource.Value));
      }
      throw new System.Exception($"DataSource {name} not found.");
    }

    /// <summary>
    /// Crea el objeto <see cref="IConnectionBuilder"/> dependiendo del tipo del origen de datos.
    /// </summary>
    /// <param name="type">Nombre del tipo de acceso a datos. Por ejemplo "SqlServer", "Sqlite", "Oracle".</param>
    /// <returns></returns>
    private static IConnectionBuilder __getBuilderFromString(string type)
    {
      return type switch {
          "SqlServer" => new Builders.SqlServerConnectionBuilder(),
          "Sqlite" => new Builders.SqliteConnectionBuilder(),
          _ => new Builders.SqlServerConnectionBuilder()
        };
    }

  }
}