
using System;
using System.Collections.Generic;
using System.Text;
using Dal.Utils;

namespace Dal.Core.Queries
{

  /// <summary>
  /// Clase con métodos para facilitar la creación de la clausula WHERE de las sentencias SQL.
  /// </summary>
  public class QueryBuilder
  {

    private readonly StringBuilder _stringBuider ;
    private readonly Dictionary<string, string> _params;

    #region constructor

    /// <summary>
    /// Inicializa una nueva instancia de la clase.
    /// </summary>
    public QueryBuilder()
    {
      _stringBuider = new StringBuilder();
      _params = new Dictionary<string, string>();
    }

    /// <summary>
    /// Inicializa una nueva instancia de la clase y añade a la lista de 
    /// parámetros una nueva entrada con el nombre y el valor proporcionados.
    /// </summary>
    /// <param name="key">Nombre</param>
    /// <param name="value"></param>
    public QueryBuilder (string key, string value) : this(new Dictionary<string, string> { { key, value } }) { }

    public QueryBuilder(Dictionary<string, string> @params) : this()
    {     
      _params = @params;
    }

    #endregion

    #region Queryparams

    public QueryBuilder Clear()
    {
      _stringBuider.Clear();
      _params.Clear();

      return this;
    }

    public QueryBuilder UseParam(string key, string value)
    {
      _params.Add(key, value);
      return this;
    }

    public string ValueOf(string key)
    {
      return _params.ContainsKey(key) ? _params[key].Trim() : "";
    }

    #endregion

    #region Properties

    public string Locator = "";

    public int Length
    {
      get
      {
        return _stringBuider.Length;
      }
    }

    #endregion

    #region methods

    public string ToQueryString()
    {
      return _stringBuider.ToString().Trim();
    }

    public string ParseListOfIntegers(string value)
    {
      return ParseListOfIntegers(value, '-');
    }

    public string ParseListOfIntegers(string value, char separator)
    {
      string[] array = value.Split(new char[] { separator }, StringSplitOptions.RemoveEmptyEntries);

      if (array.Length == 0) return "";
      try
      {
        return string.Join(",", Array.ConvertAll<string, string>(array, s => int.Parse(s).ToString()));
      }
      catch (Exception)
      {
        return "";
      }
    }

    public string ParseListOfStrings(string value)
    {
      return ParseListOfStrings(value, '-');
    }

    public string ParseListOfStrings(string value, char separator)
    {
      string[] array = value.Split(new char[] { separator }, StringSplitOptions.RemoveEmptyEntries);

      if (array.Length == 0) return "";
      try
      {
        return string.Join(",", Array.ConvertAll<string, string>(array, s => "'" + s + "'"));
      }
      catch (Exception)
      {
        return "";
      }
    }

    #endregion

    #region Filter methods

    public QueryBuilder AndDate(string fieldName)
    {
      if (ValueOf(fieldName) != "")
      {
        _stringBuider.Append(__and(string.Format("CAST ({0} AS DATE )= {1}",
                                                  fieldName,
                                                  Helper.ParseString(_params[fieldName]))));
      }
      return this;
    }

    public QueryBuilder AndInteger(string key)
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format("{0}={1}",
                                                  key,
                                                  int.Parse(_params[key]))));
      }
      return this;
    }

    public QueryBuilder AndInteger(string key, string query)
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format(query, int.Parse(_params[key]))));
      }
      return this;
    }

    public QueryBuilder AndListOfIntegers(string key, string fieldName, char separator = '-')
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format("{0} IN ({1})",
                                                   fieldName,
                                                   ParseListOfIntegers(_params[key], separator))));
      }
      return this;
    }

    public QueryBuilder AndListOfStrings(string key, string fieldName, char separator = '-')
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format("{0} IN ({1})",
                                                   fieldName,
                                                   ParseListOfStrings(_params[key], separator))));
      }
      return this;
    }

    public QueryBuilder AndReplace(string key, string query)
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format(query, Helper.ParseSqlInjection(_params[key]))));
      }
      return this;
    }

    public QueryBuilder AndSentence(string sentence)
    {
      _stringBuider.Append(__and(sentence));
      return this;
    }

    public QueryBuilder AndString(string key)
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format("{0}={1}",
                                                  key,
                                                  Helper.ParseString(_params[key]))));
      }
      return this;
    }

    public QueryBuilder AndString(string key, string fieldName)
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format("{0}='{1}'",
                                                  fieldName,
                                                  Helper.ParseSqlInjection(_params[key]))));
      }
      return this;
    }

    public QueryBuilder AndStringLike(string key)
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format("{0} LIKE '%{1}%'",
                                                  key,
                                                  Helper.ParseSqlInjection(_params[key]))));
      }
      return this;
    }

    public QueryBuilder AndStringLike(string key, string fieldName)
    {
      if (ValueOf(key) != "")
      {
        _stringBuider.Append(__and(string.Format("{0} LIKE '%{1}%'",
                                                  fieldName,
                                                  Helper.ParseSqlInjection(_params[key]))));
      }
      return this;
    }

    private string __and(string value)
    {
      return _stringBuider.Length == 0 ? value : (" AND " + value);
    }

    #endregion

  }
}
