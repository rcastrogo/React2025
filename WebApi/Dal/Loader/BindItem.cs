using System;

namespace Dal.Core.Loader
{

  /// <summary>
  /// Contenedor de la información para el enlace o mapeo de un campo de una tabla 
  /// a la propiedad de un objeto.
  /// </summary>
  public class BindItem
  {
    /// <summary>
    /// Nombre del campo privado del objeto
    /// </summary>
    public string DomainFieldName;

    /// <summary>
    /// Indice del campo en el DataReader.
    /// </summary>
    public int DbIndex;

    /// <summary>
    /// Tipo del valor.
    /// </summary>
    public Type DbType;

    /// <summary>
    /// Crea una instanacia de la clase a partir de una cadena de texto.
    /// </summary>
    /// <param name="value">Cadena con la información sobre el enlace. <code>0,_id,Integer</code></param>
    public BindItem(string value)
    {
      string[] __tokens = value.Split(new char[] { ',' });
      DomainFieldName = __tokens[1].Trim();
      DbIndex = int.Parse(__tokens[0].Trim());
      if (__tokens.Length == 2)
        DbType = typeof(string);
      else
        DbType = __tokens[2].Trim()
                            .ToLower() switch { "integer" or "int" or "int32" => typeof(int),
                                                "long"                        => typeof(long),
                                                "double"                      => typeof(double),
                                                "date" or "datetime"          => typeof(DateTime),
                                                "decimal"                     => typeof(decimal),
                                                "boolean" or "bool"           => typeof(bool),
                                                "byte()"                      => typeof(byte[]),
                                                "true-datetime"               => typeof(BinderName),
                                                _ => typeof(string)
                                              };
    }

    /// <summary>
    /// Crea un instancia de la clase
    /// </summary>
    /// <param name="fieldName">Nombre del campo privado del objeto.</param>
    /// <param name="dbIndex">Indice del campo en el DataReader.</param>
    /// <param name="dDbType">Tipo del valor.</param>
    public BindItem(string fieldName, int dbIndex, Type dDbType)
    {
      DomainFieldName = fieldName;
      DbIndex = dbIndex;
      DbType = dDbType;
    }

  }

}
