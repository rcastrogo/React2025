
namespace Dal.Core.Loader
{

  /// <summary>
  /// Contiene la información necesaria para la creación de un objeto del tipo <see cref="EntityBinder"/>.
  /// </summary>
  public class StringBinder : IEntityBinder
  {

    /// <summary>
    /// Nombre o clave del enlazador.
    /// </summary>
    public string Key;
    
    /// <summary>
    /// Información para la creación del enlazador. Información sobre la posición de los campos, 
    /// su tipo y el nombre de la propiedad asociada.
    /// <code>0,_id,Integer;1,_matricula;2,_marca</code>
    /// </summary>
    public string Value;

    /// <summary>
    /// Crea una instancia de la clase.
    /// </summary>
    /// <param name="key">Nombre o clave dado al enlazador.</param>
    /// <param name="value">Cadena de texto con la información sobre la posición de los campos, 
    /// su tipo y el nombre de la propiedad asociada. 
    /// <code>0,_id,Integer;1,_matricula;2,_marca</code>
    /// </param>
    public StringBinder(string key, string value)
    {
      Value = value;
      Key = key;
    }

  }

}
