
using Dal.Core;
using System;
using System.Text.Json.Serialization;
using System.Xml.Serialization;

namespace Negocio.Core
{
  /// <summary>
  /// Clase base de las entidades de negocio.
  /// </summary>
  [Serializable]
  public abstract class Entity
  {
    /// <summary>
    /// Delegado que posibilita la resuperación de información relacionada con la instancia pero que no está almacencada en ella.
    /// Por ejemplo obtener la descripción de un tipo cuando solo se dispone de su código en el modelo.
    /// Se utiliza generalmente a la hora de deserializar el objeto de manera personalizada.
    /// </summary>
    /// <param name="key">Clave o nombre del valor.</param>
    /// <param name="value">Entidad utilizada para.</param>
    /// <returns></returns>
    public delegate object GetExternalData(string key, Entity value);

    /// <summary>
    /// Inicializa una nueva instancia de la clase.
    /// </summary>
    public Entity(){ }

    /// <summary>
    /// Inicializa una nueva instancia de la clase.
    /// </summary>
    /// <param name="context">Contexto de base de datos a utilizar.</param>
    public Entity(DbContext context)
    {
      _dataContext = context;
    }

    /// <summary>
    /// Identificador único de las entidades.
    /// </summary>
    public abstract long Id { get; set; }

    /// <summary>
    /// Almacena una referencia a un delegado del tipo <see cref="GetExternalData"/> para recuperar valores de la entidad.
    /// </summary>
    [NonSerialized, XmlIgnore, JsonIgnore]
    public GetExternalData DataProvider;

    [NonSerialized, JsonIgnore]
    private object _Tag = null;
    /// <summary>
    /// Almacena en memoria un objeto adicional junto con la entidad.
    /// </summary>
    [XmlIgnore, JsonIgnore]
    public object Tag
    {
      get
      {
        return _Tag;
      }
      set
      {
        _Tag = value;
      }
    }

    [NonSerialized, JsonIgnore]
    private DbContext _dataContext = null;
    /// <summary>
    /// Contexto de base de datos de la entidad.
    /// </summary>
    [XmlIgnore, JsonIgnore]
    public DbContext DataContext
    {
      get
      {
        return _dataContext;
      }
      set
      {
        _dataContext = value;
      }
    }

  }
}
