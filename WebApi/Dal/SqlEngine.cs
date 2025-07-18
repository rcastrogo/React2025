using System;
using System.Data;
using System.Diagnostics;
using System.Globalization;

namespace Dal.Core
{
  /// <summary>
  /// Centralizar y encapsular las de operaciones de acceso y modificación de los datos.
  /// </summary>
  public abstract class SqlEngine
  {

    /// <summary>
    /// Centralizar todas las operaciones de acceso a base de datos.
    /// </summary>
    /// <typeparam name="T">El tipo del valor devuelto.</typeparam>
    /// <param name="cmd">El objeto IDbCommmand que se va a ejecutar./param>
    /// <returns>Un delegado para invocar la ejecución del comando.</returns>
    internal delegate T CommandHandler<T>(IDbCommand cmd);

    /// <summary>
    /// Indicador de si se deben realizar trazas de las sentencias SQL ejecutadas
    /// </summary>
    public static Boolean TraceSQLStatements = true;

    /// <summary>
    /// Constructor privado de la clase.
    /// </summary>
    private SqlEngine() { }

    /// <summary>
    /// Ejecutar un comando de modificación de registros.
    /// </summary>
    /// <param name="cmd">El commando que se va a ejecutar.</param>
    /// <returns>Número de registros afectados.</returns>
    private static int DoExecuteNonQuery(IDbCommand cmd)
    {
      int result = cmd.ExecuteNonQuery();
      if (TraceSQLStatements)
      {
        Trace.WriteLine(String.Format("{0} {1} filas",
                                      cmd.Transaction != null ? "Dal --> Transaction"
                                                              : "DAL",
                                      result));
      }
      return result;
    }

    /// <summary>
    /// Ejecutar un comando de selección de registros.
    /// </summary>
    /// <param name="cmd">El commando que se va a ejecutar.</param>
    /// <returns>Un objeto IDataReader.</returns>
    private static IDataReader DoExecuteReader(IDbCommand cmd) => cmd.ExecuteReader();

    /// <summary>
    /// Ejecutar un comando de inserción de un registro o de obtención de escalar.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="cmd">El commando que se va a ejecutar.</param>
    /// <returns>El valor devuelto por la consulta.</returns>
    private static T DoExecuteScalar<T>(IDbCommand cmd) => (T)cmd.ExecuteScalar();

    /// <summary>
    /// Centraliza las operaciones de acceso a datos y registra las trazas de las mismas.
    /// </summary>
    /// <typeparam name="T">tipo del valor devuelto.</typeparam>
    /// <param name="cmd">Objeto IDbCommand con la sentencia SQL.</param>
    /// <param name="handler">Delegado que invocar para realizar la acción.</param>
    /// <returns></returns>
    /// <exception cref="DataException">Error al ejecutar el comando.</exception>
    private static T ExecuteCommand<T>(IDbCommand cmd, CommandHandler<T> handler)
    {
      T local;
      try
      {
        if (TraceSQLStatements)
        {
          Trace.WriteLine(String.Format("{0}ExecuteCommand : {1}", 
                                        cmd.Transaction != null ? "Dal --> Transaction."
                                                                : "DAL.",
                                        __LogSQL(cmd)));          
        }
        local = handler(cmd);
      }
      catch (System.Data.DataException e)
      {
        Trace.WriteLine("--- Exception : " + e.Message);
        throw new DataException("Error inesperado al acceder a los datos.", e);
      }
      return local;
    }

    /// <summary>
    /// Ejecuta un comando de modificación de registros.
    /// </summary>
    /// <param name="cmd">El commando que se va a ejecutar.</param>
    /// <returns>El número de registros afectados.</returns>
    internal static int ExecuteNonQuery(IDbCommand cmd) => ExecuteCommand<int>(cmd, new CommandHandler<int>(DoExecuteNonQuery));

    /// <summary>
    /// Ejecuta un comando de selección de registros y devuelve un objeto IDataReader para acceder a los datos de estos.
    /// </summary>
    /// <param name="cmd">El commando que se va a ejecutar.</param>
    /// <returns>Un objeto IDataReader.</returns>
    internal static IDataReader ExecuteReader(IDbCommand cmd) => ExecuteCommand<IDataReader>(cmd, new CommandHandler<IDataReader>(DoExecuteReader));

    /// <summary>
    /// Ejecuta un comando de base de datos y devuelve el valor del primer campo.
    /// </summary>
    /// <typeparam name="T">El tipo del valor devuelto.</typeparam>
    /// <param name="cmd">El commando que se va a ejecutar.</param>
    /// <returns>El valor devuelto por la consulta.</returns>
    internal static T ExecuteScalar<T>(IDbCommand cmd) => ExecuteCommand<T>(cmd, new CommandHandler<T>(DoExecuteScalar<T>));
    
    /// <summary>
    /// Reemplaza el valor de los parámetros en la sentencia SQL.
    /// </summary>
    /// <param name="cmd">El objeto command.</param>
    /// <returns>La cadena con la sentencia SQL en la que se han incluido los valores de los parámetros.</returns>
    private static string __LogSQL(IDbCommand cmd)
    {
      var __query = cmd.CommandText;
      foreach (IDataParameter __param in cmd.Parameters)
      {
        switch (__param.DbType)
        {
          case DbType.Boolean:
            string __bool = (bool)__param.Value ? "TRUE" : "FALSE";
            __query = __query.Replace(__param.ParameterName, 
                                      __param.Value == DBNull.Value ? "NULL" 
                                                                    : __bool);
            break;
          case DbType.Int32:
          case DbType.Int64:
          case DbType.Int16:
          case DbType.UInt16:
          case DbType.UInt32:
          case DbType.UInt64:
            __query = __query.Replace(__param.ParameterName, 
                                      __param.Value == DBNull.Value ? "NULL" 
                                                                    : __param.Value.ToString());
            break;
          case DbType.Currency:
          case DbType.Decimal:
          case DbType.Double:
          case DbType.Single:
          case DbType.Date:
          case DbType.DateTime:
            __query = __query.Replace(__param.ParameterName, 
                                      string.Format( CultureInfo.InvariantCulture, 
                                                     "{0}", 
                                                     __param.Value == DBNull.Value ? "NULL" 
                                                                                   : __param.Value));
            break;
          default:
            __query = __query.Replace(__param.ParameterName, 
                                      __param.Value == DBNull.Value ? "NULL" 
                                                                    :  string.Format("'{0}'", __param.Value));
            break;
        }
      }
      return __query;
    }

  }
}
