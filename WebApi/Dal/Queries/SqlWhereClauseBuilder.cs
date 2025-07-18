
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dal.Core.Queries
{

  /// <summary>
  /// Clase con m�todos para facilitar la creaci�n de la clausula WHERE de las sentencias SQL.
  /// </summary>
  public class SqlWhereClauseBuilder
  {

    /// <summary>
    /// Para la creaci�n de los nombres de los par�metros de sentencias IN (@P1, @P2, @P3,...)
    /// </summary>
    private int __counter = 0;

    /// <summary>
    /// Utilizado para la generaci�n de la clasusula WHERE
    /// </summary>
    private readonly StringBuilder _stringBuider ;

    /// <summary>
    /// Inicializa una nueva instancia de la clase.
    /// </summary>
    /// <param name="bag">Lista de los par�metros utilizados y sus valores.</param>
    public SqlWhereClauseBuilder(ParameterBag bag = null)
    {
      Params = bag ?? new ParameterBag();
      _stringBuider = new StringBuilder();
    }

    /// <summary>
    /// Obtiene la cadena con la clausula WHERE en la que se han insertado los nombres de los campos 
    /// y los correspondientes par�metros de sustituci�n (NombreCampo = @NombreCampo)
    /// </summary>
    public string WhereClause { get => _stringBuider.ToString().Trim(); }

    /// <summary>
    /// Lista de par�metros utilizados para la generaci�n de la clausula WHER.
    /// </summary>
    public ParameterBag Params;

    /// <summary>
    /// Elimina los par�metros de la lista y limpia la cadena de la clausula WHERE.
    /// </summary>
    /// <returns>La propia instancia.</returns>
    public SqlWhereClauseBuilder Clear()
    {
      _stringBuider.Clear();
      Params.Clear();
      return this;
    }

    /// <summary>
    /// A�ade un nombre de par�metro y un valor a la lista para la generaci�n de la clausula WHERE.
    /// </summary>
    /// <param name="paramName">clave o identifiadordel par�metro. 
    /// Generalmente, aunque no obligatorio, es el nombre del campo en la tabla</param>
    /// <param name="value">Valor del par�metro.</param>
    /// <returns>La propia instancia de la clase.</returns>
    public SqlWhereClauseBuilder UseParam(string paramName, object value)
    {
      Params.Add(paramName,  new Parameter() { Value = value });
      return this;
    }

    /// <summary>
    /// Recupera el valor de un determinado par�metro.
    /// </summary>
    /// <param name="key">Nombre o clave del parametro del que se quiere obtener su valor.</param>
    /// <returns>El valor del par�metro o null si no se encuentra.</returns>
    public object ValueOf(string key)
    {
      return Params.ContainsKey(key) ? Params[key] : null;
    }

    /// <summary>
    /// A�ade una condici�n AND a la clausula SQL si existe el par�metro especificado.
    /// <para>
    /// Admite "NULL", "NOT NULL", "EMPTY"
    /// </para>
    /// </summary>
    /// <param name="paramName">Nombre o clave del par�metro.</param>
    /// <param name="fieldName">
    /// Nombre del campo sobre el que se aplicar� la comparaci�n. 
    /// Si no se proporciona se utilizar� el nombre o clave del par�metro.</param>
    /// <returns>La propia instancia de la clase.</returns>
    public SqlWhereClauseBuilder And(string paramName, string fieldName = null)
    {
      if (Params.ContainsKey(paramName))
      {
        if (Params[paramName].Value is string __value)
        {
          __value = __value.Trim();
          if (string.IsNullOrWhiteSpace(__value))
          {
            Params.Remove(paramName);
          }
          else if ("NULL" == __value.ToUpper())
          {
            Params.Remove(paramName);
            _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} IS NULL"));
          }
          else if ("NOT NULL" == __value.ToUpper())
          {
            Params.Remove(paramName);
            _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} IS NOT NULL"));
          }
          else if ("EMPTY" == __value.ToUpper())
          {
            Params.Remove(paramName);
            _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} = ''"));
          }
          else
          {
            Params[paramName].Value = __value;
            _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} = @{paramName}"));
          }
          return this;
        }
        if (Params[paramName] != null)
        {
          _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} = @{paramName}"));
          return this;
        }     
      }

      Params.Remove(paramName);
      return this;

    }

    /// <summary>
    /// A�ade una condici�n AND LIKE a la clausula SQL si existe el par�metro especificado.
    /// </summary>
    /// <param name="paramName">Nombre o clave del par�metro.</param>
    /// <param name="fieldName">
    /// Nombre del campo sobre el que se aplicar� la comparaci�n. 
    /// Si no se proporciona se utilizar� el nombre o clave del par�metro.
    /// </param>
    /// <returns>La propia instancia de la clase.</returns>
    public SqlWhereClauseBuilder AndLike(string paramName, string fieldName = null)
    {
      if (Params.ContainsKey(paramName) &&
          Params[paramName].Value is string __value &&
          !string.IsNullOrWhiteSpace(__value))
      {
        Params[paramName].Value = __value.Trim();
        _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} LIKE @{paramName}"));
      }
      else
      {
        Params.Remove(paramName);
      }
      return this;
    }

    /// <summary>
    /// A�ade una condici�n AND field IN {@P1, @P2,...} a la clausula SQL si existe el par�metro especificado.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la lista</typeparam>
    /// <param name="paramName">Nombre o clave del par�metro.</param>
    /// <param name="fieldName">
    /// Nombre del campo sobre el que se aplicar� la comparaci�n. 
    /// Si no se proporciona se utilizar� el nombre o clave del par�metro.
    /// </param>
    /// <param name="separator">Separador de los valores proporcionados. Por defecto '-'.</param>
    /// <returns>La propia instancia de la clase.</returns>
    public SqlWhereClauseBuilder AndListOf<T>(string paramName, string fieldName = null, char separator = '-')
    {
      if (Params.ContainsKey(paramName))
      {
        var __parameters = new List<(string Name, T Value)>();
        // =================================================================================================
        // El valor del par�metro es una cadena
        // =================================================================================================
        if(Params[paramName].Value is string __value)
        {
          if(!string.IsNullOrWhiteSpace(__value))
          {
            __parameters = __value.Split(new char[] { separator }, StringSplitOptions.RemoveEmptyEntries)
                                  .Select(token => (
                                    $"P{__counter++}",
                                    (T) Convert.ChangeType(token, typeof(T))
                                  ))
                                  .ToList();
          }
        }
        // =================================================================================================
        // El valor del par�metro es un array de valores
        // =================================================================================================
        if(Params[paramName].Value is Array __values)
        {
            __parameters = __values.Cast<object>()
                                   .Select(token => (
                                      $"P{__counter++}",
                                      (T) Convert.ChangeType(token, typeof(T))
                                   ))
                                   .ToList();
        }
        if(__parameters.Count() > 0)
        {
          __parameters.ForEach(p => Params.Add(p.Name, new Parameter() { Value = p.Value }));
          var __names = string.Join(",", __parameters.Select(p => $"@{p.Name}")
                                                     .ToArray());
          _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} IN ({__names})"));
        }
        Params.Remove(paramName);
      }
      return this;
    }

    /// <summary>
    /// A�ade una condici�n a la clausula SQL.
    /// </summary>
    /// <param name="sentence">Cadena con la comparaci�n a a�adir a la clausula WHERE.</param>
    /// <returns>La propia instancia de la clase.</returns>
    public SqlWhereClauseBuilder AndSentence(string sentence)
    {
      _stringBuider.Append(__safeConcat(sentence));
      return this;
    }

    /// <summary>
    /// A�ade una condici�n AND para una fecha sin la parte horaria a la clausula SQL si existe el par�metro especificado.
    /// </summary>
    /// <param name="paramName"></param>
    /// <param name="fieldName"></param>
    /// <returns></returns>
    public SqlWhereClauseBuilder AndDate(string paramName, string fieldName = null)
    {
      if (Params.ContainsKey(paramName))
      {
        if (Params[paramName].Value is string __value)
        {

          __value = __value.Trim();
          if (string.IsNullOrWhiteSpace(__value))
          {
            Params.Remove(paramName);
          }
          else if ("NULL" == __value.ToUpper())
          {
            _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} IS NULL"));
            Params.Remove(paramName);
          }
          else if ("NOT NULL" == __value.ToUpper())
          {
            _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} IS NOT NULL"));
            Params.Remove(paramName);
          }
          else
          {
           Params[paramName].Value = __value;
            _stringBuider.Append(__safeConcat($"CAST({fieldName ?? paramName} AS DATE)= CAST(@{paramName} AS DATE)"));
          }
          return this;
        }   
        
        if (Params[paramName].Value is DateTime __date)
        {
          _stringBuider.Append(__safeConcat($"CAST({fieldName ?? paramName} AS DATE)= CAST(@{paramName} AS DATE)"));
        }
      }
      return this;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="paramName"></param>
    /// <param name="fieldName"></param>
    /// <returns></returns>
    public SqlWhereClauseBuilder AndDateTime(string paramName, string fieldName = null)
    {
      if (Params.ContainsKey(paramName))
      {
        if (Params[paramName].Value is string __value)
        {

          __value = __value.Trim();
          if (string.IsNullOrWhiteSpace(__value))
          {
            Params.Remove(paramName);
          }
          else if ("NULL" == __value.ToUpper())
          {
            _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} IS NULL"));
            Params.Remove(paramName);
          }
          else if ("NOT NULL" == __value.ToUpper())
          {
            _stringBuider.Append(__safeConcat($"{fieldName ?? paramName} IS NOT NULL"));
            Params.Remove(paramName);
          }
          else
          {
           Params[paramName].Value = __value;
            _stringBuider.Append(__safeConcat($"CAST(FORMAT({fieldName ?? paramName},'yyyy-MM-dd HH:mm:ss') AS datetime) = @{paramName}"));
          }
          return this;
        }   
        
        if (Params[paramName].Value is DateTime __date)
        {
          _stringBuider.Append(__safeConcat($"CAST(FORMAT({fieldName ?? paramName},'yyyy-MM-dd HH:mm:ss') AS datetime) = CAST(FORMAT(@{paramName},'yyyy-MM-dd HH:mm:ss') AS datetime)"));
        }
      }
      return this;
    }

    /// <summary>
    /// Comprueba la longitud de la clausula WHERE generada hasta el momento para determinar si es necesario
    /// o indicar la palabra AND o WHERE.
    /// </summary>
    /// <param name="comparison">Comparaci�n l�gica.</param>
    /// <returns>Una cadena con la comparaci�n.</returns>
    private string __safeConcat(string comparison)
    {
      return _stringBuider.Length == 0 ? (" WHERE " + comparison) 
                                       : (" AND " + comparison);
    }

  }

}
