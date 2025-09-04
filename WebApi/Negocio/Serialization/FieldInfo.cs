using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Negocio.Core
{

  /// <summary>
  /// 
  /// </summary>
  public class FieldInfo
  {
    /// <summary>
    /// 
    /// </summary>
    public Type DataType;

    /// <summary>
    /// 
    /// </summary>
    public string SourcePropertyName;

    /// <summary>
    /// 
    /// </summary>
    public string DestFieldName;

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <param name="sourceName"></param>
    /// <param name="destName"></param>
    public FieldInfo(Type type, string sourceName, string destName)
    {
      DataType = type;
      SourcePropertyName = sourceName;
      DestFieldName = destName;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="typeName"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    private static Type __getTypeFromName(string typeName)
    {
      return typeName.ToLower() switch
      {
        "integer" or "int32" or "int" => typeof(int),
        "long" or "int64"             => typeof(long),
        "string"                      => typeof(string),
        "date" or "datetime"          => typeof(DateTime),
        "float" or "double"           => typeof(double),
        "decimal"                     => typeof(decimal),
        "boolean" or "bool"           => typeof(Boolean),
        _ => throw new Exception("Tipo incorrecto")
      };
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="metadata"></param>
    /// <returns></returns>
    public static FieldInfo[] FromString(string metadata)
    {
      List<FieldInfo> list = new List<FieldInfo>();
      foreach (string str in metadata.Split(new char[] { '#' }))
      {
        if (str.Trim().Length > 0)
        {
          string[] strArray = str.Split(new char[] { ',' });
          list.Add(new FieldInfo(__getTypeFromName(strArray[0].Trim()), 
                                                   strArray[1].Trim(), 
                                                   strArray[2].Trim()));
        }
      }
      return list.ToArray();
    }
  }

}




