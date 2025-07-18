using System.Collections.Generic;

namespace Dal.Core.Queries
{

  /// <summary>
  /// Contenedor de par�metros de las sentencias SQL.
  /// </summary>
  public class ParameterBag : Dictionary<string, Parameter>
  {

    /// <summary>
    /// Inicializa una nueva instancia de la clase.
    /// </summary>
    public ParameterBag() : base(){ }

    /// <summary>
    /// Inicializa una nueva instancia de la clase y a�ade un par�metro de nombre "Id" a la lista.
    /// </summary>
    /// <param name="id">Valor del par�metro.</param>
    public ParameterBag(long id)
    {
      base.Add("Id", new Parameter() { Value = id });
    }

    /// <summary>
    /// A�ade un par�metro al contenedor.
    /// </summary>
    /// <param name="name">Nombre del par�metro.</param>
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

