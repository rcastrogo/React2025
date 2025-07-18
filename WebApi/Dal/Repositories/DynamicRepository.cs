
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;

namespace Dal.Repositories
{

  /// <summary>
  /// Repositorio genérico para acceder a entidades de base de datos sin necesidad de crear 
  /// una clase específica que herede de <see cref="Dal.Core.RepositoryBase"/>
  /// <para>Permite especifiar un prefijo para acceder a las sentencias SQL con combre de los ficheros *.Queries.txt.</para>
  /// </summary>
  public class DynamicRepository : IDisposable
  {

    /// <summary>
    /// Objeto para acceder a las operaciones de <see cref="Dal.Core.RepositoryBase"/> por medio de una clase que hereda de este.
    /// </summary>
    private readonly Repository __repository;

    #region Constructor

    /// <summary>
    /// Crea una nueva instancia de la clase.
    /// </summary>
    /// <param name="dataSource">Nombre de origen de datos configurado.</param>
    /// <param name="prefix">Prefijo de las claves para recuperar las sentencias SQL con nombre.</param>
    public DynamicRepository(string dataSource = null, string prefix = null)
    {
      __repository = new Repository(dataSource, prefix);
    }

    /// <summary>
    /// Crea una nueva instancia de la clase.
    /// </summary>
    /// <param name="context">Contexto de base de datos utilizado.</param>
    /// <param name="prefix">Prefijo de las claves para recuperar las sentencias SQL con nombre.</param>
    public DynamicRepository(DbContext context, string prefix = "")
    {
      __repository = new Repository(context, prefix);
    }

    #endregion

    /// <summary>
    /// Metodo para establecer el prefijo de las claves para recuperar las sentencias SQL con nombre.
    /// </summary>
    /// <param name="prefix">Prefijo de las claves para recuperar las sentencias SQL con nombre.</param>
    /// <returns>El propio repositorio.</returns>
    public DynamicRepository UsePrefix(string prefix)
    {
      __repository.RepoPrefix = prefix;
      return this;
    }

    #region Destructor

    ~DynamicRepository()
    {
      Dispose(false);
    }

    public void Dispose()
    {
      Dispose(true);
      GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
      __repository.Dispose();
    }

    #endregion

    #region Queries

    /// <summary>
    /// 
    /// </summary>
    /// <param name="query"></param>
    /// <returns></returns>
    public IDataReader ExecuteReader(string query) => __repository.ExecuteQuery(query);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="queryName"></param>
    /// <returns></returns>
    public IDataReader ExecuteNamedReader(string queryName) => __repository.ExecuteNamedQuery(queryName);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="queryName"></param>
    /// <param name="builder"></param>
    /// <returns></returns>
    public IDataReader ExecuteNamedReader(string queryName, SqlWhereClauseBuilder builder) => __repository.ExecuteNamedQuery(queryName, builder);

    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="queryName"></param>
    /// <param name="bag"></param>
    /// <returns></returns>
    public T ExecuteNamedScalar<T>(string queryName, ParameterBag bag) => __repository.ExecuteNamedScalar<T>(queryName, bag);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="name"></param>
    /// <param name="bag"></param>
    /// <returns></returns>
    public int ExecuteNamedNonQuery(string name, ParameterBag bag) => __repository.ExecuteNamedNonQuery(name, bag);

    #endregion

    #region Carga

    /// <summary>
    /// Carga un elemento desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos del propio tipo de elemento.
    /// </summary>
    /// <typeparam name="T">Tipo del elemento.</typeparam>
    /// <param name="target">El elemento que se va a cargar.</param>
    /// <param name="dr">IDataReader con los datos del elemento.</param>
    /// <returns>El elemento con los datos cargados.</returns>
    public T LoadOne<T>(T target, IDataReader dr) where T : class, new() => Repository.LoadOne(target, dr, null);

    /// <summary>
    /// Carga un elemento desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos proporcionado.
    /// </summary>
    /// <typeparam name="T">Tipo del elemento.</typeparam>
    /// <param name="target">El elemento que se va a cargar.</param>
    /// <param name="dr">IDataReader con los datos del elemento.</param>
    /// <param name="loaderInfo">Objeto con la información sobre el mapeo de campos.</param>
    /// <returns>El elemento con los datos cargados.</returns>
    public T LoadOne<T>(T target, IDataReader dr, IEntityBinder loaderInfo) where T : class, new() => Repository.LoadOne(target, dr, loaderInfo);

    /// <summary>
    /// Carga un elemento desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos del propio tipo de elemento.
    /// </summary>
    /// <typeparam name="T">Tipo del elemento.</typeparam>
    /// <param name="target">El elemento que se va a cargar.</param>
    /// <param name="namedQuery">Nombre o clave de la sentencia SQL.</param>
    /// <returns>El elemento con los datos cargados.</returns>
    public T LoadOne<T>(T target, string namedQuery) where T : class, new() => Repository.LoadOne(target, __repository.ExecuteNamedQuery(namedQuery), null);

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos de los elementos.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="dr">IDataReader con los datos de los elementos.</param>
    /// <returns>>La colección de elementos proporcionada.</returns>
    public Collection<T> Load<T>(Collection<T> target, IDataReader dr) where T : class, new() => __repository.Load(target, dr, null);

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos de los elementos.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="dr">IDataReader con los datos de los elementos.</param>
    /// <param name="loaderInfo">Objeto con la información sobre el mapeo de campos.</param>
    /// <returns>>La colección de elementos proporcionada.</returns>
    public Collection<T> Load<T>(Collection<T> target, IDataReader dr, IEntityBinder loaderInfo) where T : class, new() => __repository.Load(target, dr, loaderInfo);

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos de los elementos.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="namedQuery">Nombre o clave de la sentencia SQL.</param>
    /// <returns></returns>
    public Collection<T> Load<T>(Collection<T> target, string namedQuery) where T : class, new() => __repository.Load(target, __repository.ExecuteNamedQuery(namedQuery), null);

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos de los elementos.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="dr">IDataReader con los datos de los elementos.</param>
    /// <returns>>La colección de elementos proporcionada.</returns>
    public IList<T> Load<T>(IList<T> target, IDataReader dr) where T : class, new() => __repository.Load(target, dr, null);

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos de los elementos.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="dr">IDataReader con los datos de los elementos.</param>
    /// <param name="loaderInfo">Objeto con la información sobre el mapeo de campos.</param>
    /// <returns>>La colección de elementos proporcionada.</returns>
    public IList<T> Load<T>(IList<T> target, IDataReader dr, IEntityBinder loaderInfo) where T : class, new() => __repository.Load(target, dr, loaderInfo);

    /// <summary>
    /// Carga una colección de elementos desde los valores de un IDataReader y utiliza la
    /// información sobre el mapeo de campos de los elementos.
    /// </summary>
    /// <typeparam name="T">Tipo de los elementos de la colección.</typeparam>
    /// <param name="target">Colección a la que se van a añadir los elementos creados.</param>
    /// <param name="namedQuery">Nombre o clave de la sentencia SQL.</param>
    /// <returns></returns>
    public IList<T> Load<T>(IList<T> target, string namedQuery) where T : class, new() => __repository.Load(target, __repository.ExecuteNamedQuery(namedQuery), null);

    #endregion

    /// <summary>
    /// Esta clase agrupa la operaciones de accesos a la base de datos. Permite especificar el prefijo de que se utilizará
    /// para obtener las sentencias SQL con nombre desde los ficheros de configuración *.Queries.txt.
    /// </summary>
    private class Repository : RepositoryBase
    {

      #region Constructor

      /// <summary>
      /// Crea una nueva instancia de la clase.
      /// </summary>
      /// <param name="dataSource">Nombre de origen de datos configurado.</param>
      public Repository(string dataSource = null) : base(dataSource) { }

      /// <summary>
      /// Crea una nueva instancia de la clase.
      /// </summary>
      /// <param name="dataSource">Nombre de origen de datos configurado.</param>
      /// <param name="repoPrefix">Prefijo de las claves para recuperar las sentencias SQL con nombre.</param>
      public Repository(string dataSource, string repoPrefix) : base(dataSource)
      {
        _repoPrefix = repoPrefix;
      }

      /// <summary>
      /// Crea una nueva instancia de la clase.
      /// </summary>
      /// <param name="context">Contexto de base de datos que se va a utilizar.</param>
      /// <param name="repoPrefix">Prefijo de las claves para recuperar las sentencias SQL con nombre.</param>
      public Repository(DbContext context, string repoPrefix) : base(context)
      {
        _repoPrefix = repoPrefix;
      }

      #endregion

      #region Queries

      /// <summary>
      /// Ejecuta una sentencia SQL de selección de registros.
      /// </summary>
      /// <param name="query">Sentencia SQL.</param>
      /// <returns>Un IDatareader con las filas devueltas por la sentencia SQL.</returns>
      public IDataReader ExecuteQuery(string query)
      {
        return Context.ExecuteReader(query);
      }

      /// <summary>
      /// Ejecuta una sentencia SQL de selección de registros.
      /// </summary>
      /// <param name="name">
      /// Nombre de la clave o sufijo si se especificó el prefijo 
      /// para recuperar la sentencia SQL con nombre.
      /// </param>
      /// <returns>Un IDatareader con las filas devueltas por la sentencia SQL.</returns>
      public IDataReader ExecuteNamedQuery(string name)
      {
        return Context.ExecuteReader(NamedQuery(name));
      }

      /// <summary>
      /// Ejecuta una sentencia SQL de selección de registros.
      /// </summary>
      /// <param name="name">
      /// Nombre de la clave o el sufijo si se especificó el prefijo 
      /// para recuperar la sentencia SQL con nombre.
      /// </param>
      /// <param name="builder">
      /// Objeto con la información de la clausula de selección y los parámetros necesatios
      /// </param>
      /// <returns>Un IDatareader con las filas devueltas por la sentencia SQL.</returns>
      public IDataReader ExecuteNamedQuery(string name, SqlWhereClauseBuilder builder)
      {
        string __query = NamedQuery(name);
        if (builder == null || builder.WhereClause == "") 
          return Context.ExecuteReader(__query);
        else
          return Context.ExecuteReader($"{__query} {builder.WhereClause}", builder.Params);
      }

      /// <summary>
      /// Ejecuta una sentencia SQL.
      /// </summary>
      /// <typeparam name="T">Tipo del valor devuelto</typeparam>
      /// <param name="name">
      /// Nombre de la clave o el sufijo si se especificó el prefijo 
      /// para recuperar la sentencia SQL con nombre.
      /// </param>
      /// <param name="bag">Valores de los parámetros de la SQL.</param>
      /// <returns>El valor de la primera columna de la primera fila devuelta por la consulta SQL.</returns>
      public T ExecuteNamedScalar<T>(string name, ParameterBag bag)
      {
        return base.ExecuteScalar<T>(__parseNamed(name), bag);
      }

      /// <summary>
      /// Ejecuta una sentencia SQL.
      /// </summary>
      /// <param name="name">
      /// Nombre de la clave o el sufijo si se especificó el prefijo 
      /// para recuperar la sentencia SQL con nombre.
      /// </param>
      /// <param name="bag">Valores de los parámetros de la SQL.</param>
      /// <returns>Número de registros afectados por la sentencia SQL.</returns>
      public int ExecuteNamedNonQuery(string name, ParameterBag bag)
      {
        return base.Context.ExecuteNonQuery(NamedQuery(name), bag);
      }

      #endregion

      private string _repoPrefix = "";

      /// <summary>
      /// Recupera o establece el prefijo utilizado para crear las claves de las sentencias SQL con nombre.
      /// </summary>
      public string RepoPrefix
      {
        get
        {
          return _repoPrefix;
        }
        internal set
        {
          _repoPrefix = value;
        }
      }

      /// <summary>
      /// Recupera el valor completo de la clave de la sentencia SQL con nombre.
      /// </summary>
      /// <param name="name">Nombre o sufijo de la sentencia SQL con nombre.</param>
      /// <returns></returns>
      private string __parseNamed(string name)
      {
        return string.IsNullOrEmpty(_repoPrefix) ? name
                                                 : $"{_repoPrefix}.{name}";
      }

      /// <summary>
      /// Recupera una sentencia SQL con nombre.
      /// </summary>
      /// <param name="name">Nombre o sufijo de la sentencia SQL con nombre.</param>
      /// <returns>Una cadena con la sentencia SQL.</returns>
      protected new string NamedQuery(string name)
      {
        return MetaDataManager.GetNamedQuery(__parseNamed(name));
      }

    }

  }

}


