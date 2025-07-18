
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Dal.Core.Loader
{

  /// <summary>
  /// Clase que contiene métodos relacionados con el mapeo o carga de los campos 
  /// de una tabla con las propiedades o campos de un objeto.
  /// </summary>
  public class EntityBinderFactory
  {

    /// <summary>
    /// Objeto utlizado para operaciones de bloqueos multi hilos.
    /// </summary>
    private static readonly object _object = new object();

    /// <summary>
    /// Cache de cargadores de objetos.
    /// </summary>
    private static readonly Dictionary<string, EntityBinder> _loaders = new Dictionary<string, EntityBinder>();

    /// <summary>
    /// Obtiene un objeto <see cref="EntityBinder"/> desde la cache de cargadores o lo crea y lo añade si no existe previamenete.
    /// </summary>
    /// <param name="data">
    /// Un objeto que implementa <see cref="IEntityBinder"/> que se utilizará para crear y/o obtener un cargador.
    /// <para>Puede ser una instancia de: <see cref="EntityBinder"/>, <see cref="BinderName"/> y <see cref="StringBinder"/></para>
    /// </param>
    /// <returns>Un objeto <see cref="EntityBinder"/> que se utilizará para cargar un objeto.</returns>
    /// <exception cref="Exception">Se produce una excepción si no se porporciona <see cref="IEntityBinder"/> para obtener el cargador.</exception>
    public static EntityBinder GetBinder(IEntityBinder data)
    {      
      lock (_object)
      {
        if (data == null) throw new Exception("El valor no puede ser nulo. GetBinder");

        if (data is EntityBinder __entityBinder) 
          return __entityBinder;
        if (data is BinderName __binderName)
        {
          if (!_loaders.ContainsKey(__binderName.Name))
          { 
            Trace.WriteLine(string.Format("Dal --> Binding --> \"{0}\"", __binderName.Name));
            _loaders.Add(__binderName.Name, Parse(MetaDataManager.GetNamedBinder(__binderName.Name)));       
          }
          return _loaders[__binderName.Name];
        }
        if (data is StringBinder __stringBinder)
        {
          if (!_loaders.ContainsKey(__stringBinder.Key))
          { 
            Trace.WriteLine(string.Format("Dal --> Binding --> \"{0}\" ({1})", __stringBinder.Key, __stringBinder.Value));
            _loaders.Add(__stringBinder.Key, Parse(__stringBinder.Value));      
          }
          return _loaders[__stringBinder.Key];
        }
        return null;
      }
    }

    /// <summary>
    /// Crea una instacia de <see cref="EntityBinder"/> a partir de una cadena de texto con el formato adecuado.
    /// </summary>
    /// <param name="value">
    /// Cadena de texto con la información de carga de los campos.
    /// <code>0,_id,Integer;3,_modelo</code>
    /// </param>
    /// <returns>
    /// Un objeto <see cref="EntityBinder"/> para utilizar en la carga de un objeto.
    /// </returns>
    public static EntityBinder Parse(string value)
    {
      Trace.WriteLine(string.Format("Dal --> Binding --> Parse {0}", new Regex(@"\s*,").Replace(value, ",")));
      EntityBinder __binder = new EntityBinder();
      foreach (string str in value.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries))
      {
        __binder.Add(new BindItem(str));
      }
      return __binder;
    }

  }

}
