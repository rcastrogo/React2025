

    //    endpoints.MapGet("/users-local", async (HttpContext context, IDbContextBuilder db) => { await __localHandleRequest(context, db); });





    //private static Task __localHandleRequest(HttpContext httpContext, IDbContextBuilder db)
    //{
    //  // ============================================
    //  // 1 - SqlDirectQuery
    //  // ============================================
    //  TestSqlDirectQuery(httpContext, db);

    //  // ============================================
    //  // 2 - SmallXmlSerializer
    //  // ============================================
    //  //TestSmallXmlSerializer(httpContext, db);

    //  // ============================================
    //  // 3 - TestDynamicRepository
    //  // ============================================
    //  //TestDynamicRepository(httpContext, db);

    //  // ============================================
    //  // 4 - TestDynamicRepositoryWithPrefix
    //  // ============================================
    //  //TestDynamicRepositoryWithPrefix(httpContext, db);

    //  // ============================================
    //  // 5 - TestIDbParameters queries
    //  // ============================================
    //  //TestIDbParams(httpContext, db);

    //  // ============================================
    //  // 6 - TestIDbParameters insert/update
    //  // ============================================
    //  TestIDbParamsForExecuteNonQueries(httpContext, db);

    //  return Task.CompletedTask;

    //  //httpContext.Response.StatusCode = (int)System.Net.HttpStatusCode.OK;
    //  //httpContext.Response.ContentType = "text/html";
    //  //httpContext.Response.WriteAsync($"<h2>Method: {httpContext.Request.Method}</h2>");
    //  //httpContext.Response.WriteAsync(JsonSerializer.Serialize(__result, new JsonSerializerOptions{IncludeFields = true }));
    //  //return Task.CompletedTask;
    //}

    //private static void TestIDbParamsForExecuteNonQueries(HttpContext httpContext, IDbContextBuilder db)
    //{
    //  using DbContext __dbContext = db.Build();

    //  var __vehiculo = new Vehiculo(__dbContext).Load(1);
    //  __vehiculo.FechaDeModificacion = "20220126";
    //  __vehiculo.Numero = 1;
    //  __vehiculo.Observaciones = "2";
    //  __vehiculo.Save();
    //  __vehiculo = __vehiculo.Load(1);
    //  __vehiculo.FechaDeModificacion = null;
    //  __vehiculo.Numero = 0;
    //  __vehiculo.Observaciones = null;
    //  __vehiculo.Save();
    //  __vehiculo = __vehiculo.Load(1);

    //}

    //private static void TestIDbParams(HttpContext httpContext, IDbContextBuilder db)
    //{
    //  using DbContext __dbContext = db.Build();

    //  var __result = __dbContext.ExecuteScalar<int>("SELECT COUNT(*) FROM [Usuario] WHERE Id > @Id",
    //                                                new ParameterBag(3)
    //                                                );
    //  // ====================================================
    //  // Todos los elementos
    //  // ====================================================
    //  var __usuarios = new Usuarios(__dbContext).Load();

    //  // ==========================================================
    //  // Buscar cadena: Nif = '04170000J'
    //  // ==========================================================
    //  var __bag = new ParameterBag().Use("Nif", "04170000J");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar con:
    //  //  - Nombre IN { 'a', 'b', 'c', 'd' }
    //  //  - Id IN {1, 2, 3, 7}
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Nombre", "a-b-c-d")
    //       .Use("Ids", "1-2-3-7");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar con:
    //  //  - Nombre IN { 'a', 'b', 'c', 'd' }
    //  //  - Id IN {1, 2, 3, 7}
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Nombre", new string[] { "a", "b", "c" })
    //       .Use("Ids", new int[] { 1, 2, 3 });
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar cadena parcialmente : Descripcion LIKE %de%
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Descripcion", "Admin%");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar cadena parcialmente : Descripcion LIKE %de%
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Descripcion", "");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por NULL
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Nif", "NULL");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por NOT NULL
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Nif", "NOT NULL");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por EMPTY
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Nif", "EMPTY");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por cadena vacía (No debe hacer nada)
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Nif", "");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por entero
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Id", 5);
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por decimal
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("Id", 5.5);
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por fecha (cadena vacía No debe hacer nada)
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("FechaDeAlta", "");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por fecha (cadena) yyyymmdd
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("FechaDeAlta", "20200203");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por fecha (NULL)
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("FechaDeAlta", "NULL");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por fecha (NOT NULL)
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("FechaDeAlta", "NOT NULL");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por fecha (DateTime) // 03/02/2020 08:31:04.297
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("FechaDeAlta", new DateTime(2020, 2, 3));
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por fecha y hora (DateTime)
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("FechaHoraDeAlta", new DateTime(2020, 2, 3, 8, 31, 4, 55));
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //  // ==========================================================
    //  // Buscar por fecha y hora (DateTime)
    //  // ==========================================================
    //  __bag.Clear()
    //       .Use("FechaHoraDeAlta", "20200203 08:31:04.00");
    //  __usuarios = new Usuarios(__dbContext).Load(__bag);

    //}

    //private static void TestDynamicRepositoryWithPrefix(HttpContext httpContext, IDbContextBuilder db)
    //{
    //  using (Dal.Repositories.DynamicRepository __repo = new Dal.Repositories.DynamicRepository()
    //                                                                         .UsePrefix("Dal.Repositories.VehiculosRepository"))
    //  {
    //    // ===============================================================================================
    //    // Uso de ExecuteReader
    //    // ===============================================================================================
    //    using (var reader = __repo.ExecuteReader("SELECT * FROM [Usuario]"))
    //    {
    //      List<object[]> rows = new List<object[]>();
    //      while (reader.Read())
    //      {
    //        object[] row = new object[2];
    //        reader.GetValues(row);
    //        rows.Add(row);
    //      }
    //    }
    //    // ===============================================================================================
    //    // Uso de ExecuteNamedScalar
    //    // ===============================================================================================     
    //    int __result = __repo.ExecuteNamedScalar<int>("Count",
    //                                                  new ParameterBag().Use("Marca", "seat"));
    //    // ===============================================================================================
    //    // Uso de ExecuteNamedReader
    //    // ===============================================================================================       
    //    using (var reader = __repo.ExecuteNamedReader("Select"))
    //    {
    //      List<object[]> rows = new List<object[]>();
    //      while (reader.Read())
    //      {
    //        object[] row = new object[6];
    //        reader.GetValues(row);
    //        rows.Add(row);
    //      }
    //    }
    //    // ===============================================================================================
    //    // Carga de entidades desde los valores de una query
    //    // ===============================================================================================
    //    Usuarios __usuarios = (Usuarios)__repo.Load(new Usuarios(),
    //                                                __repo.ExecuteReader("SELECT * FROM [Usuario]"));
    //    // ===============================================================================================
    //    // Carga de entidades desde los valores de una query con nombre
    //    // ===============================================================================================
    //    var __vehiculos = (Vehiculos)__repo.Load(new Vehiculos(), "Select");

    //    // ======================================================================================
    //    // Carga de una entidad desde los valores de una query
    //    // ======================================================================================   
    //    Usuario __usuario = __repo.LoadOne(new Usuario(),
    //                                       __repo.ExecuteReader("SELECT * FROM [Usuario]"));
    //    // ======================================================================================
    //    // Carga de una entidad desde los valores de una query con nombre
    //    // ======================================================================================
    //    var __vehiculo = __repo.LoadOne(new Vehiculo(), "Select");
    //    // ======================================================================================
    //    // Carga de una entidad desde los valores de una query con nombre
    //    // ======================================================================================
    //    __vehiculo = __repo.LoadOne(new Vehiculo(), __repo.ExecuteNamedReader("Select"));


    //    // ======================================================================================================
    //    // Carga de una entidad desde los valores de una query con nombre y con un cargador 
    //    // ======================================================================================================
    //    __vehiculo = __repo.LoadOne(new Vehiculo(),
    //                                __repo.ExecuteNamedReader("Select"),
    //                                new Dal.Core.Loader.StringBinder("Loader_V0001", "0,_id, Integer;2,_marca"));

    //    // ======================================================================================================
    //    // Carga de una entidad desde los valores de una query con nombre con un cargador configurado
    //    // ======================================================================================================
    //    __vehiculo = __repo.LoadOne(new Vehiculo(),
    //                                __repo.ExecuteNamedReader("Select"),
    //                                new Dal.Core.Loader.BinderName("Loader_V0002"));

    //    // ======================================================================================================
    //    // Carga de una entidad desde los valores de una query con nombre con un objeto cargador 
    //    // ======================================================================================================
    //    var __binder = Dal.Core.Loader.EntityBinderFactory.Parse("0,_id,int");
    //    __vehiculo = __repo.LoadOne(new Vehiculo(),
    //                                __repo.ExecuteNamedReader("Select"),
    //                                __binder);

    //    // ==========================================================================
    //    // Carga de una entidad QUE NO HEREDA DE EntityBase
    //    // ==========================================================================
    //    __binder = Dal.Core.Loader.EntityBinderFactory.Parse("0,Id,int;1,Matricula");
    //    var __moto = __repo.LoadOne(new Moto(),
    //                                __repo.ExecuteNamedReader("Select"),
    //                                __binder);
    //    // ==========================================================================
    //    // Carga de una colección de entidades QUE NO HEREDAN DE EntityBase
    //    // ==========================================================================
    //    var __motos = __repo.Load(new List<Moto>(),
    //                              __repo.ExecuteNamedReader("Select"),
    //                              __binder);
    //    var __amotos = __repo.Load(new Motos(),
    //                               __repo.ExecuteNamedReader("Select"),
    //                               __binder);
    //  }
    //}

    //private static void TestDynamicRepository(HttpContext httpContext, IDbContextBuilder db)
    //{

    //  using (Dal.Repositories.DynamicRepository __repo = new Dal.Repositories.DynamicRepository("Sqlite01"))
    //  {
    //    // ============================================================================================================
    //    // Cargar un elemento con los valores de una query
    //    // ============================================================================================================
    //    Negocio.Entities.Sqlite.Usuario __usuario = __repo.LoadOne(new Negocio.Entities.Sqlite.Usuario(),
    //                                                               __repo.ExecuteReader("SELECT * FROM [Usuario]"));
    //    // ============================================================================================================
    //    // Cargar un elemento con los valores de una query con nombre
    //    // ============================================================================================================
    //    __usuario = __repo.LoadOne(new Negocio.Entities.Sqlite.Usuario(),
    //                               "Dal.Repositories.Sqlite.UsuariosRepository.Select");
    //  }

    //  using (Dal.Repositories.DynamicRepository __repo = new Dal.Repositories.DynamicRepository())
    //  {
    //    // ============================================================================================================
    //    // Cargar un elemento con los valores de una query
    //    // ============================================================================================================
    //    Usuario __usuario = __repo.LoadOne(new Usuario(), __repo.ExecuteReader("SELECT * FROM [Usuario]"));
    //    // ============================================================================================================
    //    // Cargar un elemento con los valores de una query con nombre
    //    // ============================================================================================================
    //    __usuario = __repo.LoadOne(new Usuario(), "Dal.Repositories.UsuariosRepository.Select");
    //    // ============================================================================================================
    //    // Cargar un elemento con los valores de un dataReader
    //    // ============================================================================================================
    //    __usuario = __repo.LoadOne(new Usuario(), __repo.ExecuteNamedReader("Dal.Repositories.UsuariosRepository.Select"));
    //    // ============================================================================================================
    //    // Cargar un elemento con los valores de un dataReader con un cargador en concreto
    //    // ============================================================================================================
    //    __usuario = __repo.LoadOne(new Usuario(),
    //                               __repo.ExecuteNamedReader("Dal.Repositories.UsuariosRepository.Select"),
    //                               new Dal.Core.Loader.StringBinder("Loader_0001", "0,_id, Integer;3,_descripcion"));

    //    // ============================================================================================================
    //    // Cargar un elemento utilizando ParameterContainer y QueryBuilder y tuplas
    //    // ============================================================================================================
    //    //var builder = new Dal.Core.ParameterContainer()
    //    //                          .Add("Id", "5")
    //    //                          .AddRange(new[] { 
    //    //                                             ("Nombre", "rafa")
    //    //                                          })
    //    //                          .ToQueryBuilder()
    //    //                          .AndInteger("Id")
    //    //                          .AndString("Nombre");
    //    //__usuario = __repo.LoadOne(new Usuario(),
    //    //                            __repo.ExecuteNamedReader("Dal.Repositories.UsuariosRepository.Select",
    //    //                            builder));
    //    //builder.Clear()
    //    //       .UseParam("ID", "6")
    //    //       .AndInteger("ID");
    //    //__usuario = __repo.LoadOne(new Usuario(),
    //    //                            __repo.ExecuteNamedReader("Dal.Repositories.table_name.SelectAll", builder));
    //    //// =======================================================================================================
    //    //// Cargar varios elemento reutilizando QueryBuilder
    //    //// =======================================================================================================
    //    //builder.Clear()
    //    //       .UseParam("Ids", "6-5")
    //    //       .AndListOfIntegers("Ids", "ID");
    //    //var __x1 = __repo.Load( new Usuarios(),
    //    //                        __repo.ExecuteNamedReader("Dal.Repositories.table_name.SelectAll",
    //    //                        builder));



    //  }
    //}

    //private static void TestSmallXmlSerializer(HttpContext httpContext, IDbContextBuilder db)
    //{
    //  string __result = "";
    //  // =========================================================================================
    //  // Cargar entidades desde SqlServer
    //  // =========================================================================================
    //  Proveedor __item = new Proveedor().Load(10);
    //  Proveedores __items = new Proveedores().Load();
    //  // =========================================================================================
    //  // Cargar entidades desde Sqlite
    //  // =========================================================================================    
    //  Negocio.Entities.Sqlite.Usuario __usuario = new Negocio.Entities.Sqlite.Usuario().Load(3);
    //  Negocio.Entities.Sqlite.Usuarios __usuarios = new Negocio.Entities.Sqlite.Usuarios().Load();

    //  // =================================================================================
    //  // 1 - Serializar Entity y EntityList
    //  //     Esto serializará TODAS las propiedades del objeto
    //  // =================================================================================
    //  SmallXmlSerializer __serializer = new SmallXmlSerializer(__item.GetType(), __items);
    //  __result = __serializer.ToJsonString(__item);
    //  __result = __serializer.ToJsonString();
    //  __result = __item.ToJsonString();
    //  __result = __items.ToJsonString();
    //  __result = __items.ToJsonString(
    //                          new FieldInfo[] {
    //                            new FieldInfo(typeof(string), "Nombre", "n")
    //                          });
    //  // =========================================================
    //  // AssociativeArray
    //  // =========================================================
    //  __result = __serializer.ToJsonString(true);
    //  // =========================================================
    //  // Especificar elementos despues de creado el serializador.
    //  // =========================================================
    //  __result = __serializer.Use(__items.Where(p => p.Id > 8)
    //                                     .ToList(), false)
    //                         .ToJsonString();
    //  // =========================================================
    //  // Serialización/deserialización Xml
    //  // =========================================================
    //  __result = __item.ToXml();
    //  var __itemXml = __result.FromXmlTo<Proveedor>();
    //  __result = __items.ToXml();
    //  var __itemsXml = __result.FromXmlTo<Proveedores>();
    //  // =========================================================
    //  // Serialización/deserialización Json
    //  // =========================================================
    //  __result = __item.ToJsonString();
    //  var __itemJson = __result.FromJsonTo<Proveedor>();
    //  __result = __items.ToJsonString();
    //  var __itemsJson = __result.FromJsonTo<Proveedores>();


    //  // =================================================================================
    //  // 2 - Serializar objetos que heredan de Entity especificando la información de los
    //  //     Campos.
    //  // =================================================================================
    //  __serializer = new SmallXmlSerializer(
    //                        typeof(Proveedor),
    //                        __items,
    //                        new[] {
    //                          (typeof(long), "Id", "i"),
    //                          (typeof(string), "Nombre", "n")
    //                        });
    //  __result = __serializer.ToJsonString();

    //  // =================================================================================
    //  // 3 - Serializar los objetos creados dinámicamente por el método de extensión
    //  // =================================================================================
    //  var __values = __serializer.GetValues();
    //  // ======================================
    //  // Serialización Json
    //  // ======================================
    //  __result = __values.ToJsonString();
    //  // ======================================
    //  // Serialización Xml
    //  // ======================================
    //  __result = __values.ToXml();
    //  __result = __values[0].ToXml();

    //  // =================================================================================
    //  // 4.1 - Serializar STRUCT que NO heredan de Entity
    //  // =================================================================================
    //  var __dates = new DateTime[] { DateTime.Now, DateTime.Now };
    //  __serializer = new SmallXmlSerializer(
    //                        typeof(DateTime),
    //                        __dates,
    //                        new[] {
    //                          (typeof(int), "Year", "y"),
    //                          (typeof(int), "Day", "day")
    //                        },
    //                        true);
    //  __result = __serializer.ToJsonString();

    //  // =================================================================================
    //  // 4.2 - Serializar objetos que NO heredan de Entity
    //  // =================================================================================
    //  var __types = System.Reflection.Assembly.GetExecutingAssembly()
    //                                          .DefinedTypes
    //                                          .ToList();
    //  __serializer = new SmallXmlSerializer(
    //                        typeof(System.Reflection.TypeInfo),
    //                        __types,
    //                        new[] {
    //                          (typeof(bool), "IsAbstract", "a"),
    //                          (typeof(string), "FullName", "name")
    //                        },
    //                        true);

    //  __result = __serializer.ToJsonString();
    //  __values = __serializer.GetValues();
    //  __result = __values.ToJsonString();
    //  __result = __values[0].ToJsonString();
    //  __result = __values.ToXml();
    //  __result = __values[0].ToXml();

    //  // =========================================================================================
    //  // 5.1 - Obtener un serializador configurado: #Proveedor@Negocio.Entities.Proveedor@Entity
    //  // =========================================================================================
    //  __serializer = SerializersStringRepository.GetNamedSerializer("Proveedor", __items);
    //  __result = __serializer.ToJsonString();
    //  __values = __serializer.GetValues();
    //  __result = __values.ToJsonString();
    //  __result = __values[0].ToJsonString();
    //  __result = __values.ToXml();
    //  __result = __values[0].ToXml();
    //  // ========================================
    //  // Especificar el DataProvider
    //  // ========================================
    //  __items.SetDataProvider((key, data) =>
    //  {
    //    if (key == "edad") return data.Id;
    //    return "";
    //  });
    //  __serializer.Use(__items);
    //  __result = __serializer.ToJsonString();

    //  // =========================================================================================
    //  // 5.2 - Obtener un serializador configurado: #TypeInfo@System.Reflection.TypeInfo@Simple
    //  // =========================================================================================
    //  __serializer = SerializersStringRepository.GetNamedSerializer("TypeInfo", __types);
    //  __result = __serializer.ToJsonString();
    //  __values = __serializer.GetValues();
    //  __result = __values.ToJsonString();
    //  __result = __values[0].ToJsonString();
    //  __result = __values.ToXml();
    //  __result = __values[0].ToXml();

    //  __result = "";

    //}

    //private static void TestSqlDirectQuery(HttpContext httpContext, IDbContextBuilder db)
    //{
    //  using DbContext __dbContext = db.Build("Sqlite01");

    //  // =========================================================================================================
    //  //                                             1 - LoadFromQuery
    //  // =========================================================================================================
    //  // DbContext, Query, Nombre
    //  // =========================================================================================================
    //  var __data = SqlDirectQuery.LoadFromQuery(__dbContext, @"SELECT id, name FROM Usuario", "Usuario_A");
    //  // =========================================================================================================
    //  // DbContext, Query
    //  // =========================================================================================================
    //  __data = SqlDirectQuery.LoadFromQuery(__dbContext, @"SELECT id, name as nombre FROM Usuario");
    //  // =========================================================================================================
    //  // Query, Nombre
    //  // =========================================================================================================
    //  __data = SqlDirectQuery.LoadFromQuery(@"SELECT Id, Nif, Nombre, Descripcion FROM [Proveedor]", "Proveedor");
    //  // =========================================================================================================
    //  // Query
    //  // =========================================================================================================
    //  __data = SqlDirectQuery.LoadFromQuery(@"SELECT Id, Nombre, Descripcion FROM [Proveedor]");


    //  // =========================================================================================================
    //  //                                           2 - LoadFromNamedQuery
    //  // =========================================================================================================
    //  // DbContext, Query
    //  // =========================================================================================================
    //  __data = SqlDirectQuery.LoadFromNamedQuery(__dbContext, "Dal.Repositories.Sqlite.UsuariosRepository.Select");
    //  // =========================================================================================================
    //  // Query
    //  // =========================================================================================================
    //  __data = SqlDirectQuery.LoadFromNamedQuery("Dal.Repositories.VehiculosRepository.Select");


    //  // =========================================================================================================
    //  //                                      3 - CreateAndFillSerializerFromQuery
    //  // =========================================================================================================
    //  var __serializer = SqlDirectQuery.CreateAndFillSerializerFromQuery("Sqlite_Usuarios",
    //                                                                      __dbContext,
    //                                                                      @"SELECT * FROM Usuario");
    //  __data = __serializer.GetValues();
    //  string __json = __serializer.ToJsonString();


    //  // =========================================================================================================
    //  //                                         4 - CreateAndFillSerializer
    //  // =========================================================================================================
    //  // Name, DbContext, NamedQuery
    //  // =========================================================================================================
    //  __serializer = SqlDirectQuery.CreateAndFillSerializer("Sqlite_Select",
    //                                                         __dbContext,
    //                                                         "Dal.Repositories.Sqlite.UsuariosRepository.Select");
    //  __data = __serializer.GetValues();
    //  __json = __serializer.ToJsonString();
    //  // ===========================================================================================================
    //  // Name, DbContext, NamedQuery, ExtensionPoint, extraColumns
    //  // ===========================================================================================================
    //  __serializer = SqlDirectQuery.CreateAndFillSerializer("Sqlite_Usuarios_01",
    //                                                         __dbContext,
    //                                                         "Dal.Repositories.Sqlite.UsuariosRepository.Select",
    //                                                         delegate (string key, System.Data.IDataRecord reader)
    //                                                         {
    //                                                           if (key == "key1") return 1;
    //                                                           return 1;
    //                                                         },
    //                                                         "#int,~key1,indexValue");
    //  __data = __serializer.GetValues();
    //  __json = __serializer.ToJsonString();
    //  // ===========================================================================================================
    //  // Name, DbContext, NamedQuery, ExtensionPoint, extraColumns, QueryBuilder
    //  // ===========================================================================================================
    //  __serializer = SqlDirectQuery.CreateAndFillSerializer("Sqlite_Usuarios_02",
    //                                                         __dbContext,
    //                                                         "Dal.Repositories.Sqlite.UsuariosRepository.Select",
    //                                                         delegate (string key, System.Data.IDataRecord reader)
    //                                                         {
    //                                                           if (key == "key1") return 1;
    //                                                           return 1;
    //                                                         },
    //                                                         "#int,~key1,indexValue",
    //                                                         new Dal.Core.Queries
    //                                                                     .SqlWhereClauseBuilder()
    //                                                                     .UseParam("Id", 6)
    //                                                                     .And("Id"));
    //  __data = __serializer.GetValues();
    //  __json = __serializer.ToJsonString();
    //}

    //// ==========================================================================
    //// Entidades QUE NO HEREDAN DE EntityBase
    //// ==========================================================================
    //private class Moto
    //{
    //  public int Id = 0;
    //  public string Matricula = "";
    //};

    //private class Motos : System.Collections.ObjectModel.Collection<Moto> { }
