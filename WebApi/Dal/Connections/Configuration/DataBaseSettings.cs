
using System.Collections.Generic;

namespace Dal.Core.Connections.Configuration;

/// <summary>
/// Clase que sirve de contenedor de la configuración relativa al acceso a datos.
/// Se inicializa desde el fichero de configuración.
/// </summary>
public class DataBaseSettings {

  /// <summary>
  /// Diccionario que contiene los nombres de los origenes de datos configurados. 
  /// Al menos debe existir un origen de datos con nombre "Default"
  /// <code>
  /// "DataSources": {
  ///    "Default": {
  ///      "Type": "SqlServer",
  ///      "Value": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=..."
  ///    },
  ///    "Sqlite01": {
  ///      "Type": "Sqlite",
  ///      "Value": "Data Source=C:\\Proyectos\\AspNetCore6\\RouteToCode\\WebApi\\sqliteDB.db"
  ///    }
  ///  }</code>
  /// </summary>
  public Dictionary<string, DataSource> DataSources { get; set; }

}

