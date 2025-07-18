
using Dal.Core;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text.Json.Serialization;
using System.Xml.Serialization;

namespace Negocio.Core
{

  /// <summary>
  /// Inicializa una instacia de colecciones de entidades.
  /// </summary>
  /// <typeparam name="T">Tipo de la entidad de los elementos</typeparam>
  [Serializable]
  public abstract class EntityList<T> : Collection<T> where T : Entity
  {
    [NonSerialized, JsonIgnore]
    private object _tag;
    [NonSerialized, JsonIgnore]
    private object _dataContext;

    /// <summary>
    /// Inicializa una instancia de la clase.
    /// </summary>
    public EntityList()
    {
      _tag = null;
      _dataContext = null;
    }

    /// <summary>
    /// Inicializa una instancia de la clase.
    /// </summary>
    /// <param name="context">Contexto de base de datos a utilizar.</param>
    public EntityList(DbContext context)
    {
      _tag = null;
      _dataContext = context;
    }

    /// <summary>
    /// Establecer un delegado del tipo <see cref="Entity.GetExternalData"/> a todas las entidades de la lista.
    /// </summary>
    /// <param name="dataProvider">El delegado a establecer.</param>
    /// <returns></returns>
    public EntityList<T> SetDataProvider(Entity.GetExternalData dataProvider)
    {
      foreach (Entity entity in this)
      {
        entity.DataProvider = dataProvider;
      }
      return this;
    }

    /// <summary>
    /// Ordena los elementos de la lista.
    /// </summary>
    public void Sort()
    {
      ((List<T>)Items).Sort();
    }

    /// <summary>
    /// Almacena en memoria un objeto adicional junto con la entidad.
    /// </summary>
    [XmlIgnore, JsonIgnore]
    public object Tag
    {
      get
      {
        return _tag;
      }
      set
      {
        _tag = value;
      }
    }

    /// <summary>
    /// Contexto de base de datos de la entidad.
    /// </summary>
    [XmlIgnore, JsonIgnore]
    public DbContext DataContext
    {
      get
      {
        return (DbContext)_dataContext;
      }
      set
      {
        _dataContext = value;
      }
    }

  }
}
