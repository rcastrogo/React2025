
using System;
using System.Collections.Generic;

namespace Dal.Core.Loader
{

  /// <summary>
  /// Contiene la informaci�n sobre la carga o mapeo de los valores de un DataReader a
  /// los de los campos de un objeto.
  /// </summary>
  public class EntityBinder : IEntityBinder
  {
    /// <summary>
    /// Delegado que se invoca para cargar un objeto. El m�todo que realiza la carga se crea en tiempo de ejecuci�n.
    /// </summary>
    public Delegate FillObjectDelegate;

    /// <summary>
    /// Delegado que se invoca para cargar una colecci�n de objetos. El m�todo que realiza la carga se crea en tiempo de ejecuci�n.
    /// </summary>
    public Delegate FillObjectsDelegate;

    /// <summary>
    /// Elementos que se cargan o mapea.
    /// </summary>
    private readonly List<BindItem> _items = new List<BindItem>();

    /// <summary>
    /// A�adir un campo a la lista de elemnetos a cargar o mapear.
    /// </summary>
    /// <param name="value"></param>
    public void Add(BindItem value) => _items.Add(value);

    /// <summary>
    /// Obtiene la lista de elmentos del enlazador.
    /// </summary>
    /// <returns></returns>
    public List<BindItem> BindItems() => _items;

    /// <summary>
    /// Obtinene el enlazador de un campo por su posici�n en la lista.
    /// </summary>
    /// <param name="index">Posici�n del elemento que se quiere recuperar.</param>
    /// <returns>Un objeto del tipo <see cref="BindItem"/>.</returns>
    public BindItem this[int index] => _items[index];

  }

}
