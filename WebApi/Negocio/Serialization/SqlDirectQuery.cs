
using System;
using Dal.Core;
using Dal.Core.Queries;

namespace Negocio.Core
{

  /// <summary>
  /// Permite la creación y carga de objetos desde sentencias SQL.
  /// </summary>
  public class SqlDirectQuery
  {

    /// <summary>
    /// Contructor privado de la clase.
    /// </summary>
    private SqlDirectQuery() { }

    /// <summary>
    /// Crear y cargar un conjunto de objetos a partir de la información de una sentencia SQL de selección
    /// de registros. Se crea en tiempo de ejecución un nuevo tipo con un constructor que permite la carga
    /// de los campos de este desde el datareader.
    /// </summary>
    /// <param name="query">Sentencia SQL de selección de registros.</param>
    /// <param name="name">Nombre dado al serializador (y al tipo) que posibilita su reutización posterior.</param>    
    /// <returns>Una lista de objetos con los campos de una sentencia SQL.</returns>
    public static System.Collections.IList LoadFromQuery(string query, string name = null)
    {
      String __name = name ?? String.Format("Query_{0:X}", query.GetHashCode());
      return CreateAndFillSerializerFromQuery(__name, query).GetValues();
    }

    /// <summary>
    /// Crear y cargar un conjunto de objetos a partir de la información de una sentencia SQL de selección
    /// de registros. Se crea en tiempo de ejecución un nuevo tipo con un constructor que permite la carga
    /// de los campos de este desde el datareader.
    /// </summary>
    /// <param name="context">Contexto de base de datos utilizado.</param>
    /// <param name="query">Semtencia SQL de selección de registros.</param>
    /// <param name="name">Nombre dado al serializador (y al tipo) que posibilita su reutización posterior.</param>
    /// <returns>Una lista de objetos con los campos de una sentencia SQL.</returns>
    public static System.Collections.IList LoadFromQuery(DbContext context, string query, string name = null)
    {
      String __name = name ?? String.Format("Query_{0:X}", query.GetHashCode());
      return CreateAndFillSerializerFromQuery(__name, context, query).GetValues();
    }

    /// <summary>
    /// Crear y cargar un conjunto de objetos a partir de la información de una sentencia SQL de selección
    /// de registros. Se crea en tiempo de ejecución un nuevo tipo con un constructor que permite la carga
    /// de los campos de este desde el datareader.
    /// </summary>
    /// <param name="name">
    /// El nombre dado a una sentencia SQL existente en algún fichero *.Queries.txt incluido 
    /// como recurso incrustado en el ensamblado.
    /// </param>
    /// <returns>Una lista de objetos con los campos de una sentencia SQL.</returns>
    public static System.Collections.IList LoadFromNamedQuery(string name)
    {
      String __name = String.Format("Query_{0:X}", name.GetHashCode());
      return CreateAndFillSerializer(__name, null, name).GetValues();
    }

     /// <summary>
    /// Crear y cargar un conjunto de objetos a partir de la información de una sentencia SQL de selección
    /// de registros. Se crea en tiempo de ejecución un nuevo tipo con un constructor que permite la carga
    /// de los campos de este desde el datareader.
    /// </summary>
    /// <param name="context">Contexto de base de datos utilizado.</param>
    /// <param name="name">
    /// El nombre dado a una sentencia SQL existente en algún fichero *.Queries.txt incluido 
    /// recurso incrustado en el ensamblado.
    /// </param>
    /// <returns>Una lista de objetos con los campos de una sentencia SQL.</returns>
    public static System.Collections.IList LoadFromNamedQuery(DbContext context, string name)
    {
      String __name = String.Format("Query_{0:X}", name.GetHashCode());
      return CreateAndFillSerializer(__name, context, name).GetValues();
    }

    /// <summary>
    /// Crea un serializador capaz de deserializar un tipo creado y cargado a partir de una sentencia SQL.
    /// </summary>
    /// <param name="name">Nombre dado al serializador (y al tipo) que posibilita su reutización posterior.</param>
    /// <param name="context">Contexto de base de datos utilizado.</param>
    /// <param name="query">Sentencia SQL de selección de registros.</param>
    /// <returns>Un objeto del tipo SmallXmlSerializer.</returns>
    public static SmallXmlSerializer CreateAndFillSerializerFromQuery(string name, DbContext context, string query)
    {
      using var __repo = new Dal.Repositories.DynamicRepository(context);
      using var __reader = __repo.ExecuteReader(query);
      return new SmallXmlSerializer(__reader, name);
    }

    /// <summary>
    /// Crea un serializador capaz de deserializar un tipo creado y cargado a partir de una sentencia SQL.
    /// </summary>
    /// <param name="name">Nombre dado al serializador (y al tipo) que posibilita su reutización posterior.</param>
    /// <param name="query">Sentencia SQL de selección de registros.</param>
    /// <returns>Un objeto del tipo SmallXmlSerializer.</returns>
    public static SmallXmlSerializer CreateAndFillSerializerFromQuery(string name, string query)
    {
      using var __context = Dal.Core.Connections.ConnectionManager.CreateDbContext();
      return SqlDirectQuery.CreateAndFillSerializerFromQuery(name, __context, query);
    }

    /// <summary>
    /// Crea un serializador capaz de deserializar un tipo creado y cargado a partir de una sentencia SQL.
    /// </summary>
    /// <param name="name">Nombre dado al serializador (y al tipo) que posibilita su reutización posterior.</param>
    /// <param name="context">Contexto de base de datos utilizado.</param>
    /// <param name="queryName">
    /// El nombre dado a una sentencia SQL existente en algún fichero *.Queries.txt incluido 
    /// como recurso incrustado en el ensamblado.
    /// </param>
    /// <param name="extensionPoint">Delegado utlizado para la carga de campos no incluidos en la sentencia SQL pero 
    /// si relacionados de alguna forma con los datos devueltos. Por ejemplo para personalizar el valor de un campo
    /// de la tabla.</param>
    /// <param name="extraColumns">Cadena de texto para especificar campos adicionales para utilizar junto 
    /// con el extensionPoint:
    /// <para>#Integer,~key1,Prueba#String,~key2,PruebaS</para>
    /// </param>
    /// <param name="queryBuilder">
    /// Instancia de la clase encargada de crear el WHERE de la sentencia SQL.
    /// </param>
    /// <returns>Un objeto del tipo SmallXmlSerializer.</returns>
    public static SmallXmlSerializer CreateAndFillSerializer(string name,
                                                             DbContext context,
                                                             string queryName,
                                                             ExtensionPoint extensionPoint = null,
                                                             string extraColumns = "",
                                                             SqlWhereClauseBuilder queryBuilder = null)
    {
      using var __repo = new Dal.Repositories.DynamicRepository(context);
      using var __reader = __repo.ExecuteNamedReader(queryName, queryBuilder);
      return new SmallXmlSerializer(__reader, name, extraColumns, extensionPoint);
    }

    /// <summary>
    /// Crea un serializador capaz de deserializar un tipo creado y cargado a partir de una sentencia SQL.
    /// </summary>
    /// <param name="name">Nombre dado al serializador (y al tipo) que posibilita su reutización posterior.</param>
    /// <param name="context">Contexto de base de datos utilizado.</param>
    /// <param name="queryName">
    /// El nombre dado a una sentencia SQL existente en algún fichero *.Queries.txt incluido 
    /// como recurso incrustado en el ensamblado.
    /// </param>
    /// <param name="queryBuilder">
    /// Instancia de la clase encargada de crear el WHERE de la sentencia SQL.
    /// </param>
    /// <returns>Un objeto del tipo SmallXmlSerializer.</returns>
    public static SmallXmlSerializer CreateAndFillSerializer(string name,
                                                             DbContext context,
                                                             string queryName,
                                                             SqlWhereClauseBuilder queryBuilder)
    {
      return CreateAndFillSerializer(name, context, queryName, null, null, queryBuilder);
    }

  }

}




