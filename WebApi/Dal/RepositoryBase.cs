using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using Dal.Core.Connections;
using Dal.Core.Loader;
using Dal.Core.Queries;

namespace Dal.Core
{

  /// <summary>
  /// Clase base de todos los repositorios. Inicializa el contexto de base de datos y
  /// proporciona métodos CRUD.
  /// </summary>
  public abstract class RepositoryBase : IDisposable
  {

    /// <summary>
    /// Contexto de base de datos utilizado para las operaciones.
    /// </summary>
    protected DbContext Context;

    /// <summary>
    /// Indicador de si es la instancia la que crea el contexto de base de datos.
    /// Se utiliza para determinar si es necesario liberarlo en el método Dispose.
    /// </summary>
    private readonly bool _auto;

    /// <summary>
    /// Atributos personalizados de la clase. Se utiliza para obtener el nombre y origen de datos del repositorio.
    /// </summary>
    object[] _attrs;

    /// <summary>
    /// Inicializa una instancia de la clase y crea un contexto de base de datos.
    /// </summary>
    /// <param name="dataSource">Nombre del origen de datos configurado</param>
    internal RepositoryBase(string dataSource = null)
    {
      _auto = true;
      _attrs = GetType().GetCustomAttributes(true);
      Context = ConnectionManager.CreateDbContext(dataSource ?? RepoDataSource());
    }

    /// <summary>
    /// Inicializa una instancia de la clase utilizando un contexto de base de datos. Si es null crea uno nuevo.
    /// </summary>
    /// <param name="context">Contexto de base de datos.</param>
    internal RepositoryBase(DbContext context)
    {
      Context = context;
      _attrs = GetType().GetCustomAttributes(true);
      if (Context == null)
      {
        _auto = true;
        Context = ConnectionManager.CreateDbContext(RepoDataSource());
      }
    }

    /// <summary>
    /// Libera los recursos
    /// </summary>
    public void Dispose()
    {
      Dispose(true);
      GC.SuppressFinalize(true);
    }

    /// <summary>
    /// Libera el contexto de base de datos si se creó al instanciar la clase.
    /// </summary>
    /// <param name="disposing"></param>
    protected virtual void Dispose(bool disposing)
    {
      if (_auto) Context.Dispose();
    }

    /// <summary>
    /// Elimina un registro de la base de datos.
    /// </summary>
    /// <param name="id">El identificador único del registro.</param>
    /// <returns>Un valor que indica si se ha podido eliminar el registro.</returns>
    public virtual int Delete(long id)
    {
      var __query = DefaultDeleteQuery(RepoPrefix());
      return Context.ExecuteNonQuery(__query, new ParameterBag(id));
    }

    /// <summary>
    /// Proporciona el acceso a valores de un registro determinado.
    /// </summary>
    /// <param name="id">Idntificador único de la entidad.</param>
    /// <returns>Un IDataReader con el resultado de la consulta.</returns>
    public virtual IDataReader GetItem(long id)
    {
      var __query = DefaultSelectQuery(RepoPrefix()) + " WHERE Id = @Id";
      return Context.ExecuteReader(__query, new ParameterBag(id));
    }

    /// <summary>
    /// Proporciona el acceso a los valores de todos los registros.
    /// </summary>
    /// <returns>Un IDataReader con el resultado de la consulta.</returns>
    public virtual IDataReader GetItems()
    {
      return Context.ExecuteReader(string.Format("{0} ORDER BY {1};",
                                                 DefaultSelectQuery(RepoPrefix()),
                                                 DefaultOrderBy(RepoPrefix())));
    }

    /// <summary>
    /// Proporciona el acceso a los valores de todos los registros.
    /// </summary>
    /// <param name="builder">Una instancia del constructor de la clausula WHERE para 
    /// limitar el número de registros devuelto por la consulta SQL de selección.</param>
    /// <returns>Un IDataReader con el resultado de la consulta.</returns>
    internal virtual IDataReader GetItems(SqlWhereClauseBuilder builder)
    {
      string __query = DefaultSelectQuery(RepoPrefix());
      string __orderBy = DefaultOrderBy(RepoPrefix());
      return Context.ExecuteReader($"{__query} {builder.WhereClause} ORDER BY {__orderBy}", 
                                   builder.Params);
    }

    /// <summary>
    /// Ejecuta la sentencia SQL de inserción de registros del repositorio.
    /// </summary>
    /// <param name="bag">Valores de los parámetros de la sentencia SQL.</param>
    /// <returns>El identificador del nuevo registro insertado.</returns>
    internal virtual long Insert(ParameterBag bag)
    {
      return Context.ExecuteScalar<long>(DefaultInsertQuery(RepoPrefix()), bag);
    }

    /// <summary>
    /// Ejecuta la sentencia SQL (NamedQuery) para inserción de registros.
    /// </summary>
    /// <param name="namedQuery">Nombre o clave completa de la sentencia SQL.</param>
    /// <param name="bag">Valores de los parámetros de la sentencia SQL.</param>
    /// <returns>El identificador del nuevo registro insertado.</returns>
    internal virtual long Insert(string namedQuery, ParameterBag bag)
    {
      return Context.ExecuteScalar<long>(MetaDataManager.GetNamedQuery(namedQuery), bag);
    }

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="dr">IDataReader con los datos de los elementos.</param>
    /// <returns>La colección de elementos proporcionada.</returns>
    public Collection<T> Load<T>(Collection<T> target, IDataReader dr) where T : class, new()
    {
      return Load<T>(target, dr, null);
    }

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="dr">IDataReader con los datos de los elementos.</param>
    /// <returns>La colección de elementos proporcionada.</returns>
    public IList<T> Load<T>(IList<T> target, IDataReader dr) where T : class, new()
    {
      return Load<T>(target, dr, null);
    }

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos de los elementos.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="dr">IDataReader con los datos de los elementos.</param>
    /// <param name="loaderInfo">Objeto con la información sobre el mapeo de campos.</param>
    /// <returns>>La colección de elementos proporcionada.</returns>
    public Collection<T> Load<T>(Collection<T> target, IDataReader dr, IEntityBinder loaderInfo) where T : class, new()
    {
      Load((IList<T>) target, dr, loaderInfo);
      return target;
    }

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos de los elementos.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="dr">IDataReader con los datos de los elementos.</param>
    /// <param name="loaderInfo">Objeto con la información sobre el mapeo de campos.</param>
    /// <returns>>La colección de elementos proporcionada.</returns>
    public IList<T> Load<T>(IList<T> target, IDataReader dr, IEntityBinder loaderInfo) where T : class, new()
    {
      target = (loaderInfo != null) ? Dal.Core.Loader.Loader.LoadObjects<T>(target, dr, EntityBinderFactory.GetBinder(loaderInfo), Context) :
                                      Dal.Core.Loader.Loader.LoadObjects<T>(target, 
                                                                            dr, 
                                                                            EntityBinderFactory.GetBinder(new BinderName(typeof(T).ToString())), 
                                                                            Context);
      return target;
    }

    /// <summary>
    /// Carga un elemento desde los valores de un IDataReader.
    /// </summary>
    /// <typeparam name="T">Tipo del elemento.</typeparam>
    /// <param name="target">El elemento que se va a cargar.</param>
    /// <param name="dr">IDataReader con los datos del elemento.</param>
    /// <returns>El elemento con los datos cargados.</returns>
    public T LoadOne<T>(T target, IDataReader dr) where T : class, new()
    {
      return LoadOne<T>(target, dr, null);
    }

    /// <summary>
    /// Carga un elemento desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos del elemento.
    /// </summary>
    /// <typeparam name="T">Tipo del elemento.</typeparam>
    /// <param name="target">El elemento que se va a cargar.</param>
    /// <param name="dr">IDataReader con los datos del elemento.</param>
    /// <param name="loaderInfo">Objeto con la información sobre el mapeo de campos.</param>
    /// <returns>El elemento con los datos cargados.</returns>
    public static T LoadOne<T>(T target, IDataReader dr, IEntityBinder loaderInfo) where T : class, new()
    {
      if (loaderInfo == null)
      {
        Loader.Loader.LoadObject<T>(target, 
                                    dr, 
                                    EntityBinderFactory.GetBinder(new BinderName(target.GetType().ToString())));
      }
      else
      {
        Loader.Loader.LoadObject<T>(target, 
                                    dr, 
                                    EntityBinderFactory.GetBinder(loaderInfo));
      }
      return target;
    }

    /// <summary>
    /// Ejecuta la sentencia SQL de actualización (NamedQuery) del repositorio.
    /// </summary>
    /// <param name="values">Valores de los parámetros.</param>
    /// <returns>Un valor entero que indica si se ha podido actualizar el registro.</returns>
    internal virtual int Update(ParameterBag bag)
    {
      return Context.ExecuteNonQuery(DefaultUpdateQuery(RepoPrefix()), bag);
    }

    /// <summary>
    /// Ejecuta una sentencia SQL de actualización (NamedQuery)  
    /// </summary>
    /// <param name="namedQuery">Nombre o clave completa de la sentencia configurada.</param>
    /// <param name="bag">Valores de los parámetros.</param>
    /// <returns>Un valor entero que indica si se ha podido actualizar el registro.</returns>
    internal virtual int Update(string namedQuery, ParameterBag bag)
    {
      return Context.ExecuteNonQuery(MetaDataManager.GetNamedQuery(namedQuery), bag);
    }

    /// <summary>
    /// Obtener una sentencia SQL configurada para el repositorio.
    /// </summary>
    /// <param name="name">La parte final, sin incluir el prefijo del repositorio, del nombre.</param>
    /// <returns>La sentencia SQL.</returns>
    protected string NamedQuery(string name)
    {
      return MetaDataManager.GetNamedQuery(string.Format("{0}.{1}", RepoPrefix(), name));
    }

    /// <summary>
    /// Obtener desde la configuración la correspondiente sentencia SQL (NamedQuery) del repositorio.
    /// </summary>
    /// <param name="typeName">El prefijo utilizado para el repositorio en los ficheros *.Queries.txt</param>
    /// <returns>La cadena SQL</returns>
    private string DefaultDeleteQuery(string typeName)
    {
      return MetaDataManager.GetNamedQuery(string.Format("{0}.Delete", typeName));
    }

    /// <summary>
    /// Obtener desde la configuración la correspondiente sentencia SQL (NamedQuery) del repositorio.
    /// </summary>
    /// <param name="typeName">El prefijo utilizado para el repositorio en los ficheros *.Queries.txt</param>
    /// <returns>La cadena SQL</returns>
    private string DefaultInsertQuery(string typeName)
    {
      return MetaDataManager.GetNamedQuery($"{typeName}.Insert");
    }

    /// <summary>
    /// Obtener desde la configuración la correspondiente sentencia SQL (NamedQuery) del repositorio.
    /// </summary>
    /// <param name="typeName">El prefijo utilizado para el repositorio en los ficheros *.Queries.txt</param>
    /// <returns>La cadena SQL</returns>
    private string DefaultOrderBy(string typeName)
    {
      return MetaDataManager.GetNamedQuery($"{typeName}.OrderBy");
    }

    /// <summary>
    /// Obtener desde la configuración la correspondiente sentencia SQL (NamedQuery) del repositorio.
    /// </summary>
    /// <param name="typeName">El prefijo utilizado para el repositorio en los ficheros *.Queries.txt</param>
    /// <returns>La cadena SQL</returns>
    private string DefaultSelectQuery(string typeName)
    {
      return MetaDataManager.GetNamedQuery($"{typeName}.Select");
    }

    /// <summary>
    /// Obtener desde la configuración la correspondiente sentencia SQL (NamedQuery) del repositorio.
    /// </summary>
    /// <param name="typeName">El prefijo utilizado para el repositorio en los ficheros *.Queries.txt</param>
    /// <returns>La cadena SQL</returns>
    private string DefaultUpdateQuery(string typeName)
    {
      return MetaDataManager.GetNamedQuery($"{typeName}.Update");
    }

    /// <summary>
    /// Obtiene el prefijo de configuración asignado al repositorio por medio de un atributo en la clase.
    /// </summary>
    /// <returns>
    /// Una cadena con el nombre del prefijo.
    /// </returns>
    private string RepoPrefix()
    {
      if(_attrs.Length > 0 && 
         _attrs[0] is RepoName __attribute) return __attribute.Name.Split("@")[0];
      return "";
    }

    /// <summary>
    /// Obtiene el nombre del origen de datos asignado al repositorio por medio de un atributo en la clase.
    /// </summary>
    /// <returns>
    /// Una cadena con el nombre del origen de datos que utilizará el repositorio.
    /// </returns>
    private string RepoDataSource()
    {    
      if(_attrs.Length > 0 && 
         _attrs[0] is RepoName __attribute)
      {
        var __tokens = __attribute.Name.Split("@");
        if(__tokens.Length > 1) return  __tokens[1];
      }
      return "Default";
    }

    /// <summary>
    /// Ejecuta y devuelve el escalar de una sentencia SQL con un nombre determinado
    /// </summary>
    /// <typeparam name="T">El tipo del valor devuelto.</typeparam>
    /// <param name="namedQuery">El nombre o clave de NamedQuery.</param>
    /// <param name="bag">Valores de los parámetros de la sentencia SQL.</param>
    /// <returns>El valor recuperado.</returns>
    internal virtual T ExecuteScalar<T>(string namedQuery, ParameterBag bag)
    {
      return Context.ExecuteScalar<T>(MetaDataManager.GetNamedQuery(namedQuery), bag);
    }

  }
}
