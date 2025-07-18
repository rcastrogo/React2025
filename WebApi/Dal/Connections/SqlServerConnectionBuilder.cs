
using System;
using System.Collections;
using System.Diagnostics;
using Dal.Core.Connections;
using Microsoft.Data.SqlClient;

namespace Dal.Core.Connections.Builders
{
  /// <summary>
  /// Clase que representa un constructor de conexiones a bases de datos SqlServer.
  /// </summary>
  public class SqlServerConnectionBuilder : IConnectionBuilder
  {

    private static Hashtable _hash = new Hashtable();

    /// <summary>
    /// Crea y abre una conexión de base de datos SqlServer
    /// </summary>
    /// <param name="connectionString">Candena de conexión a la base de datos.</param>
    /// <returns>Un objeto <see cref="System.Data.IDbConnection"/> para acceder a la base de datos.</returns>
    public System.Data.IDbConnection CreateConnection(string connectionString)
    {
      SqlConnection _connection = new(connectionString);
      int __hashCode = _connection.GetHashCode();
      _connection.Open();
      _hash.Add(__hashCode, DateTime.Now);
      _connection.Disposed += OnDisposeConnection;
      Trace.WriteLineIf(SqlEngine.TraceSQLStatements, 
                        $"DAL --> SqlServerConnectionBuilder.CreateConnection : {__hashCode}");
      return _connection;
    }

    /// <summary>
    /// Interceptar la liberación de la conexión con la base de datos
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private static void OnDisposeConnection(object sender, EventArgs e)
    {
      int __hashCode = sender.GetHashCode();
      double __delta = (DateTime.Now - ((DateTime)_hash[__hashCode])).TotalMilliseconds;
      Trace.WriteLineIf(SqlEngine.TraceSQLStatements, 
                        $"DAL --> SqlServerConnectionBuilder.DisposeConnection : {__hashCode} {__delta:0.000} milliseconds");
      _hash.Remove(sender.GetHashCode());
    }

  }
}
