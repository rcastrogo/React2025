
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using Microsoft.Data.SqlClient;
using Dal.Core.Queries;
using Microsoft.AspNetCore.Http.Metadata;

namespace Dal.Core
{
  /// <summary>
  /// Esta clase sirve para centralizar las operaciones de acceso y modificaci�n de una base de datos.
  /// </summary>
  public class DbContext : IDisposable
  {

    /// <summary>
    /// Colecci�n de commandos utilizados. Se deben cerrar y liberar en Dispose.
    /// Sqlite cierra el DataReader en el dispose. El resto no.
    /// </summary>
    private readonly List<IDbCommand> _commands = new(1);

    #region Constructor

    /// <summary>
    /// Constructor privado
    /// </summary>
    private DbContext() : base() { }

    /// <summary>
    /// Constructor solo disponible desde el ensamblado
    /// </summary>
    /// <param name="connection">Conexi�n de base de datos.</param>
    internal DbContext(IDbConnection connection)
    {
      _connection = connection;
    }

    #endregion

    #region destructor

    public void Dispose()
    {
      Dispose(true);
      GC.SuppressFinalize(true);
    }

    /// <summary>
    /// Liberar y cerrar conexiones y comandos utilizados.
    /// </summary>
    /// <param name="disposing"></param>
    protected virtual void Dispose(bool disposing)
    {
      if (!disposing)
      {
        _connection = null;
      }
      else if (_connection != null)
      {
        _connection.Close();
        _connection.Dispose();
        _connection = null;
      }
      _commands.ForEach(c => c.Dispose());
    }

    #endregion

    #region connections

    private IDbConnection _connection = null; 

    #endregion

    #region bulkCopy

    public void BulkCopy(string destinationTableName, IDataReader dataReader, string[] mapInfo)
    {
      BulkCopy(destinationTableName, dataReader, mapInfo, SqlBulkCopyOptions.TableLock);
    }

    public void BulkCopy(string destinationTableName, IDataReader dataReader, string[] mapInfo, SqlBulkCopyOptions options)
    {
      using (SqlBulkCopy sqlBulkCopy = CreateSqlBulkCopy(options))
      {
        foreach (string __map in mapInfo)
        {
          string[] __tokens = __map.Split(new char[] { '|' });
          sqlBulkCopy.ColumnMappings.Add(__tokens[0], __tokens[1]);
        }
        sqlBulkCopy.DestinationTableName = destinationTableName;
        sqlBulkCopy.BulkCopyTimeout = 0;
        sqlBulkCopy.BatchSize = 5000;
        Trace.WriteLineIf(SqlEngine.TraceSQLStatements, string.Format("BulkCopy.Begin -> {0}", destinationTableName));
        sqlBulkCopy.WriteToServer(dataReader);
        Trace.WriteLineIf(SqlEngine.TraceSQLStatements, string.Format("{0} rows", dataReader.RecordsAffected));
        Trace.WriteLineIf(SqlEngine.TraceSQLStatements, "BulkCopy.End");
      }
    }

    public SqlBulkCopy CreateSqlBulkCopy(SqlBulkCopyOptions options)
    {
      return new SqlBulkCopy((SqlConnection)_connection, options, (SqlTransaction)_transaction);
    }

    #endregion

    #region transactions

    private IDbTransaction _transaction = null;

    /// <summary>
    /// Inicia una transacci�n de base de datos
    /// </summary>
    public void BeginTransaction()
    {
      _transaction = _connection.BeginTransaction();
      Trace.WriteLineIf(SqlEngine.TraceSQLStatements, "Dal --> BeginTransaction");
    }

    /// <summary>
    /// Confirma la transacci�n en curso.
    /// </summary>
    public void Commit()
    {
      if (_transaction == null)
      {
        Trace.WriteLineIf(SqlEngine.TraceSQLStatements, "Dal --> Commit: No existe Transacci�n en curso");
      }
      else
      {
        _transaction.Commit();
        _transaction.Dispose();
        _transaction = null;
        Trace.WriteLineIf(SqlEngine.TraceSQLStatements, "Dal --> Commit");
      }
    }

    /// <summary>
    /// Cancela los cambios realizados durante la transacci�n.
    /// </summary>
    public void Rollback()
    {
      if (_transaction == null)
      {
        Trace.WriteLineIf(SqlEngine.TraceSQLStatements, "Dal --> Rollback : No existe Transacci�n en curso");
      }
      else
      {
        _transaction.Rollback();
        _transaction.Dispose();
        _transaction = null;
        Trace.WriteLineIf(SqlEngine.TraceSQLStatements, "Dal --> Rollback");
      }
    }

    #endregion

    #region commands

    /// <summary>
    /// Crea un nuevo comando, le asigna la conexi�n y la transacci�n y lo agrega, opcionalmente, a
    /// una lista para su posterior liberaci�n en el m�todo Dispose().
    /// </summary>
    /// <param name="autoDisposed">Un valor true hace que se libere autom�ticamente el comando.</param>
    /// <returns></returns>
    internal IDbCommand CreateCommand(bool autoDisposed = true)
    {
      IDbCommand command = _connection.CreateCommand();
      command.Connection = _connection;
      command.Transaction = _transaction;
      if(autoDisposed) _commands.Add(command);
      return command;
    }

    /// <summary>
    /// Ejecuta una sentencia SQL de modificaci�n de registros.
    /// </summary>
    /// <param name="query">La sentencia SQL.</param>
    /// <returns>El n�mero de registros afectados.</returns>
    public int ExecuteNonQuery(string query)
    {
      IDbCommand cmd = CreateCommand();
      cmd.CommandText = query;
      return SqlEngine.ExecuteNonQuery(cmd);
    }

    /// <summary>
    /// Ejecuta una sentencia SQL de modificaci�n de registros.
    /// </summary>
    /// <param name="query">La sentencia SQL.</param>
    /// <param name="bag">Valores de los par�metros de la sentencia SQL.</param>
    /// <returns>El n�mero de registros afectados.</returns>
    public int ExecuteNonQuery(string query, ParameterBag bag)
    {
      IDbCommand cmd = CreateCommand();
      cmd.CommandText = query;
      __setParameters(cmd, bag);
      return SqlEngine.ExecuteNonQuery(cmd);
    }

    /// <summary>
    /// Ejecuta una sentencia de selecci�n de registros y devuelve un IDataReader.
    /// </summary>
    /// <param name="query">Sentencia SQL de selecci�n de registros.</param>
    /// <returns>Un objeto <see cref="IDataReader"/> para acceder a los valores de los registros.</returns>
    public IDataReader ExecuteReader(string query)
    {
      IDbCommand cmd = CreateCommand();
      cmd.CommandText = query;
      return SqlEngine.ExecuteReader(cmd);       
    }

    /// <summary>
    /// Ejecuta una sentencia de selecci�n de registros y devuelve un IDataReader.
    /// </summary>
    /// <param name="query">La sentencia SQL.</param>
    /// <param name="bag">Valores de los par�metros de la sentencia SQL.</param>
    /// <returns>Un objeto <see cref="IDataReader"/> para acceder a los valores de los registros.</returns>
    public IDataReader ExecuteReader(string query, ParameterBag bag)
    {
      IDbCommand cmd = CreateCommand();
      cmd.CommandText = query;
      __setParameters(cmd, bag);
      return SqlEngine.ExecuteReader(cmd);
    }

    /// <summary>
    /// Ejecuta una sentencia SQL de inserci�n de registros o de selecci�n de escalar.
    /// </summary>
    /// <typeparam name="T">El Tipo del valor devuelto.</typeparam>
    /// <param name="query">Sentencia SQL.</param>
    /// <returns></returns>
    public T ExecuteScalar<T>(string query)
    {
      using IDbCommand cmd = CreateCommand(false);
      cmd.CommandText = query;
      return SqlEngine.ExecuteScalar<T>(cmd);
    }

    /// <summary>
    /// Ejecuta una sentencia SQL de inserci�n de registros o de selecci�n de escalar.
    /// </summary>
    /// <typeparam name="T">El Tipo del valor devuelto.</typeparam>
    /// <param name="query">Sentencia SQL.</param>
    /// <param name="bag">Valores de los par�metros de la sentencia SQL.</param>
    /// <returns></returns>
    public T ExecuteScalar<T>(string query, ParameterBag bag)
    {
      using IDbCommand cmd = CreateCommand(false);
      cmd.CommandText = query;
      __setParameters(cmd, bag);
      return SqlEngine.ExecuteScalar<T>(cmd);  
    }

    /// <summary>
    /// Establece los par�metros de la consulta SQL.
    /// </summary>
    /// <param name="cmd">Objeto <see cref="IDbCommand"/> al que aplicar los par�metros.</param>
    /// <param name="parameters">Contenedor de los par�metros.</param>
    private void __setParameters(IDbCommand cmd, ParameterBag bag)
    {
      if(bag is not null)
      {
        bag.Select(value => new { DbParameter = cmd.CreateParameter(), 
                                  Name        = value.Key,
                                  Parameter   = value.Value })
           .ToList()
           .ForEach(item => {
             var __val = item.Parameter.Value;             
             item.DbParameter.ParameterName = "@" + item.Name;
             if (item.Parameter.IsNullable && (
                 __val == null                                             || 
                 __val == DBNull.Value                                     ||
                 __val.ToString().Length == 0                              ||
                 (__val.GetType() == typeof(short) && (0 == (short)__val)) ||
                 (__val.GetType() == typeof(int) && (0 == (int)__val))     ||
                 (__val.GetType() == typeof(long) && (0L == (long)__val))  ||
                 (__val.GetType() == typeof(DateTime) && DateTime.MinValue == (DateTime)__val)
             ))    
               item.DbParameter.Value = DBNull.Value;
             else
               item.DbParameter.Value = __val;

             cmd.Parameters.Add(item.DbParameter);
           });
      }  
    }

    #endregion

  }

}
