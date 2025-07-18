
namespace Dal.Core.Loader;

/// <summary>
/// Contenedor del nombre de un enlazador configurado en uno de los ficheros *.binders.txt
/// </summary>
/// <param name="Name"></param>
public record BinderName (string Name) : IEntityBinder;


