using System.Collections.Generic;

namespace Dal.Core.Queries
{

  /// <summary>
  /// Contenedor de parámetros de las sentencias SQL.
  /// </summary>
  public class ParameterBag : Dictionary<string, Parameter>
  {

    /// <summary>
    /// Inicializa una nueva instancia de la clase.
    /// </summary>
    public ParameterBag() : base(){ }

    /// <summary>
    /// Inicializa una nueva instancia de la clase y añade un parámetro de nombre "Id" a la lista.
    /// </summary>
    /// <param name="id">Valor del parámetro.</param>
    public ParameterBag(long id)
    {
      base.Add("Id", new Parameter() { Value = id });
    }

    /// <summary>
    /// Añade un parámetro al contenedor.
    /// </summary>
    /// <param name="name">Nombre del parámetro.</param>
    /// <param name="value">Valor del parametro.</param>
    /// <returns>El propio objeto contenedor</returns>
    public ParameterBag Use(string name, object value, bool isNullable = false )
    {
      base.Add(name, new Parameter() { Value = value, IsNullable = isNullable });
      return this;
    }

    /// <summary>
    /// Elimina todos los parametros de la lista.
    /// </summary>
    /// <returns>El propio objeto contenedor</returns>
    public new ParameterBag Clear()
    {
      base.Clear();
      return this;
    }

  }

  public class Parameter
  {
    public object Value;
    public bool IsNullable = false;
  }

}

