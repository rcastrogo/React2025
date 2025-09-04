
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Xml;
using System.Xml.Serialization;

namespace Negocio.Core
{

  /// <summary>
  /// Clase que permite serializar objetos de forma personalidada. Es posible especificar qué propiedades o campos
  /// se deben serializar así como el nombre de estos. Para realizar la serialización se crea un tipo dinámicamente
  /// un tipo con las propiedades indicadas. Posteriormente, a la hora de serializar, se van creando instancias 
  /// del tipo para serializarlas. Eel objeto "origen" se pasa al invocar el constructor de las instancias.
  /// </summary>
  public class SmallXmlSerializer
  {
    /// <summary>
    /// Relación de los tipos creados.
    /// </summary>
    private static readonly Dictionary<string, Type> _types = new Dictionary<string, Type>();
    private static readonly ModuleBuilder _moduleBuilder = null;
    private static readonly object _object = new object();
    private readonly Type _targetType = null;
    private bool _createObjects = true;
    private IList _values = null;

    #region constructor

    /// <summary>
    /// Constructor estático para inicializar el modulo dinámico en el que se crearan lo tipos.
    /// </summary>
    static SmallXmlSerializer()
    {
      Trace.WriteLine("SmallXmlSerializer -> DefineDynamicAssembly.");
      AssemblyBuilder builder = AssemblyBuilder.DefineDynamicAssembly(new AssemblyName("DynamicTypes"), AssemblyBuilderAccess.Run);
      _moduleBuilder = builder.DefineDynamicModule(builder.GetName().Name);
    }

    /// <summary>
    /// Crea un serializador para procesar los datos de un dataReader. El tipo resultante tendrá los
    /// mismos campos públicos que la sentencia SQL de selección.
    /// </summary>
    /// <param name="reader">El dataReader con los registros.</param>
    /// <param name="name">Nombre dado al serializador (y al tipo) que posibilita su reutización posterior.</param>
    /// <param name="extraColumns">Cadena de texto para especificar campos adicionales para utilizar junto 
    /// con el extensionPoint:
    /// <para>#Integer,~key1,Prueba#String,~key2,PruebaS</para>
    /// </param>
    /// <param name="extensionPoint">
    /// Función que se invocará para obtener un valor que se debe serializar pero que no se encuentra entre los
    /// campos disponibles en el DataReader. 
    /// </param>
    public SmallXmlSerializer(IDataReader reader,
                              string name,
                              string extraColumns = "",
                              ExtensionPoint extensionPoint = null)
    {
      // ==================================================================================================
      // Creación del tipo
      // ==================================================================================================
      string __name = $"{name}_SqlType";
      Type __type = null;
      if (!_types.ContainsKey(__name))
      {
        string columns = string.Join("#", Enumerable.Range(0, reader.FieldCount)
                                                    .Select(i => string.Format("{0},{1},{2}",
                                                                               reader.GetFieldType(i).Name,
                                                                               i,
                                                                               ToCamelCase(
                                                                                 reader.GetName(i)
                                                                               )))
                                                    .ToArray());
        if (extraColumns != null && extraColumns.Length > 0)
          columns += extraColumns; // #Integer,~key1,Prueba#String,~key2,PruebaS
        __type = CreateSqlType(__name, FieldInfo.FromString(columns));
      }
      else
      {
        __type = _types[__name];
      }
      // ==================================================================================================
      // Creación de los objetos
      // ==================================================================================================
      _targetType = __type;
      _createObjects = false;
      _values = new List<object>();
      while (reader.Read())
        _values.Add(Activator.CreateInstance(__type, new object[] { reader, extensionPoint }));
    }

    /// <summary>
    /// Crea una nueva instancia del serializador
    /// </summary>
    /// <param name="type">Tipo del objeto que se quiere serializar.</param>
    /// <param name="values">Lista de objetos del tipo indicado que se quieren serializar.</param>
    public SmallXmlSerializer(Type type, IList values = null)
    {
      _values = values;
      _targetType = type;
      _createObjects = false;
    }

    /// <summary>
    /// Crea una nueva instancia del serializador.
    /// </summary>
    /// <param name="sourceType">Tipo del objeto origen que se quiere serializar</param>
    /// <param name="info">Información sobre las propiedades o campos del objeto destino que se deserializa.</param>
    /// <param name="simple">Si el objeto origen no hereda de Entity este parámetro debe ser true</param>
    public SmallXmlSerializer(Type sourceType, FieldInfo[] info, bool simple = false) :
      this(sourceType, info, "", simple)
    { }

    /// <summary>
    /// Crea una nueva instancia del serializador
    /// </summary>
    /// <param name="sourceType">Tipo del objeto origen que se quiere serializar.</param>
    /// <param name="info">Información sobre las propiedades o campos del objeto destino que se deserializa.</param>
    /// <param name="key">
    /// Nombre dado al serializador (y al tipo) que posibilita su reutilización posterior. Solo se utiliza
    /// si simple = false.
    /// </param>
    /// <param name="simple">Si el objeto origen no hereda de Entity este parámetro debe ser true.</param>
    public SmallXmlSerializer(Type sourceType, FieldInfo[] info, string key = "", bool simple = false)
    {
      _targetType = simple ? CreateSimpleType(sourceType, info)
                           : CreateType(sourceType, info, key);
    }

    /// <summary>
    /// Crea una nueva instancia del serializador.
    /// </summary>
    /// <param name="sourceType">Tipo del objeto origen que se quiere serializar.</param>
    /// <param name="info">Información sobre las propiedades o campos del objeto destino que se deserializa.</param>
    /// <param name="values">Lista de valores utilizados para la serialización.</param>
    /// <param name="simple">Si el objeto origen no hereda de Entity este parámetro debe ser true.</param>
    public SmallXmlSerializer(Type sourceType, FieldInfo[] info, IList values, bool simple = false) :
      this(sourceType, info, simple)
    {
      _values = values;
    }

    /// <summary>
    /// Crea una nueva instancia del serializador.
    /// </summary>
    /// <param name="sourceType">Tipo del objeto origen que se quiere serializar.</param>
    /// <param name="fields">
    /// Información sobre las propiedades o campos del objeto destino que se deserializa.
    /// <para>
    /// <code>
    /// new[] { 
    ///   (typeof(int), "Id", "_id"),
    ///   (typeof(string), "Name", "_name"),
    ///   (typeof(string), "Tag", "_tag")
    /// }
    /// </code>
    /// </para>
    /// </param>
    /// <param name="simple">Si el objeto origen no hereda de Entity este parámetro debe ser true.</param>
    public SmallXmlSerializer(Type sourceType, (Type type, string sourceName, string destName)[] fields, bool simple = false)
    {
      var __info = fields.Select(value => new FieldInfo(value.type,
                                                        value.sourceName,
                                                        value.destName))
                         .ToArray();
      _targetType = simple ? CreateSimpleType(sourceType, __info)
                            : CreateType(sourceType, __info);
    }

    /// <summary>
    /// Crea una nueva instancia del serializador.
    /// </summary>
    /// <param name="sourceType">Tipo del objeto origen que se quiere serializar.</param>
    /// <param name="values">Lista de valores utilizados para la serialización.</param>
    /// <param name="fields">
    /// Información sobre las propiedades o campos del objeto destino que se deserializa.
    /// <para>
    /// <code>
    /// new[] { 
    ///   (typeof(int), "Id", "_id"),
    ///   (typeof(string), "Name", "_name"),
    ///   (typeof(string), "Tag", "_tag")
    /// }
    /// </code>
    /// </para>
    /// </param>
    /// <param name="simple">Si el objeto origen no hereda de Entity este parámetro debe ser true.</param>
    public SmallXmlSerializer(Type sourceType, IList values, (Type type, string sourceName, string destName)[] fields, bool simple = false) :
        this(sourceType, fields, simple)
    {
      _values = values;
    }


    #endregion

    /// <summary>
    /// Crea, o devuelve si ya se ha creado, un tipo dinámico con un constructor que acepta dos parametros: 
    ///    - System.Data.IDataRecord
    ///    - ExtensionPoint
    /// Se usa en SqlDirectQuery.CreateAndFillSerializer() para crear dinamicamente objetos e inicializarlos
    /// con los valores de las filas.
    /// </summary>
    /// <param name="name">Nombre del tipo. Obligatorio</param>
    /// <param name="info">
    /// Datos sobre el enlace de los valores del IDataRecord y los campos del objeto creado.
    /// Si la propieda/campo comienza con "~" se invoca, si no es null, el delegado ExtensionPoint
    /// y se le pasa (key, IDataRecord) para devolver una cadena en consecuencia.
    /// </param>
    /// <returns>
    /// El tipo creado.
    /// </returns>
    private static Type CreateSqlType(string name, FieldInfo[] info)
    {
      Type type;
      lock (_object)
      {
        if (_types.ContainsKey(name)) return _types[name];
        // =====================================================================================
        // Definición de la clase
        // =====================================================================================
        TypeBuilder builder = _moduleBuilder.DefineType(name,
                                                        TypeAttributes.BeforeFieldInit |
                                                        TypeAttributes.AutoClass |
                                                        //TypeAttributes.Serializable |
                                                        TypeAttributes.Public,
                                                        typeof(object));
        // =====================================================================================
        // Atributo XmlRootAttribute
        // =====================================================================================
        var __attrCtor = typeof(XmlRootAttribute).GetConstructor(new Type[] { typeof(string) });
        var __attrBuilder = new CustomAttributeBuilder(__attrCtor, new object[] { "row" });
        builder.SetCustomAttribute(__attrBuilder);
        // =====================================================================================
        // Definición del constructor sin parametros de la clase
        // =====================================================================================
        ILGenerator iLGenerator = builder.DefineConstructor(MethodAttributes.RTSpecialName |
                                                            MethodAttributes.SpecialName |
                                                            MethodAttributes.Public,
                                                            CallingConventions.Standard,
                                                            new Type[0])
                                         .GetILGenerator();
        iLGenerator.Emit(OpCodes.Ldarg_0);
        iLGenerator.Emit(OpCodes.Call, typeof(object).GetConstructor(new Type[0]));
        // =====================================================================================
        // Definición del constructor con parametros de la clase
        // =====================================================================================
        Type[] parameterTypes = new Type[] { typeof(IDataRecord), typeof(ExtensionPoint) };
        ILGenerator generator2 = builder.DefineConstructor(MethodAttributes.RTSpecialName |
                                                           MethodAttributes.SpecialName |
                                                           MethodAttributes.Public,
                                                           CallingConventions.Standard,
                                                           parameterTypes)
                                        .GetILGenerator();
        // =====================================================================================
        // Llamar al constructor de Object (MyBase.new())
        // =====================================================================================
        generator2.Emit(OpCodes.Ldarg_0);
        generator2.Emit(OpCodes.Call, typeof(object).GetConstructor(new Type[0]));
        // =====================================================================================
        // Declaración y carga de variables locales:
        //  - ExtensionPoint       - Stloc_0
        //  - ExtencionPointIsNull - Stloc_1
        // =====================================================================================
        generator2.DeclareLocal(typeof(ExtensionPoint));
        generator2.DeclareLocal(typeof(int));
        generator2.Emit(OpCodes.Ldarg_2);
        generator2.Emit(OpCodes.Stloc_0);
        generator2.Emit(OpCodes.Ldloc_0);
        generator2.Emit(OpCodes.Ldnull);
        generator2.Emit(OpCodes.Ceq);
        generator2.Emit(OpCodes.Stloc_1);
        // =====================================================================================
        // Crear y llenar campos
        // =====================================================================================
        FieldInfo[] infoArray = info;
        int index = 0;
        while (true)
        {
          if (index >= infoArray.Length)
          {
            // ==================================================================
            // Salir del constructor
            // ==================================================================
            generator2.Emit(OpCodes.Ret);
            // ==================================================================
            // Crear el tipo y devolverlo
            // ==================================================================
            _types.Add(name, builder.CreateType());
            Trace.WriteLine("SmallXmlSerializer -> CreateDynamicType : " + name);
            type = _types[name];
            break;
          }
          FieldInfo info2 = infoArray[index];
          if (info2.SourcePropertyName.StartsWith("~"))
          {
            // ==============================================================================
            // Valores desde el campo del IDataRecord
            // ============================================================================== 
            FieldBuilder field = builder.DefineField(info2.DestFieldName,
                                                     info2.DataType,
                                                     FieldAttributes.Public);
            Label label = generator2.DefineLabel();
            // =====================================================================================
            // Si ExtensionPoint is nothing no se invoca el delegado
            // =====================================================================================
            generator2.Emit(OpCodes.Ldloc_1);
            generator2.Emit(OpCodes.Brtrue, label);
            // =====================================================================================
            // Invocar el delegado para obtener el valor personalizado
            // =====================================================================================
            generator2.Emit(OpCodes.Ldarg_0);
            generator2.Emit(OpCodes.Ldloc_0);                                          // Delegado 
            generator2.Emit(OpCodes.Ldstr, info2.SourcePropertyName.Replace("~", "")); // key
            generator2.Emit(OpCodes.Ldarg_1);                                          // DataReader
            generator2.Emit(OpCodes.Callvirt, typeof(ExtensionPoint).GetMethod("Invoke"));
            // =====================================================================================
            // Convertir/formatear el valor
            // =====================================================================================           
            if (info2.DataType == typeof(DateTime))
            {
              generator2.Emit(OpCodes.Unbox, typeof(DateTime));
              generator2.Emit(OpCodes.Ldstr, "dd/MM/yyyy HH:mm:ss");
              parameterTypes = new Type[] { typeof(string) };
              generator2.Emit(OpCodes.Callvirt, typeof(DateTime).GetMethod("ToString", parameterTypes));
            }
            else
            {
              generator2.Emit(OpCodes.Unbox_Any, info2.DataType);
            }
            generator2.Emit(OpCodes.Stfld, field);
            generator2.MarkLabel(label);
          }
          else
          {
            // =======================================================================================================
            // Valores desde el campo del IDataRecord
            // =======================================================================================================
            Label label = generator2.DefineLabel();

            // =======================================================================================================
            // Comprobar si el valor del campo es DbNull para no cargarlo
            // =======================================================================================================
            int arg = int.Parse(info2.SourcePropertyName);
            generator2.Emit(OpCodes.Ldarg_1);      // DataRecord
            generator2.Emit(OpCodes.Ldc_I4, arg);  // Indice
            generator2.Emit(OpCodes.Callvirt, typeof(IDataRecord).GetMethod("IsDBNull"));
            generator2.Emit(OpCodes.Brtrue, label);
            // =======================================================================================================
            // Recuperar el valor del campo
            // =======================================================================================================
            generator2.Emit(OpCodes.Ldarg_0);
            generator2.Emit(OpCodes.Ldarg_1);         // DataRecord
            generator2.Emit(OpCodes.Ldc_I4, arg);     // Indice
            generator2.Emit(OpCodes.Callvirt, typeof(IDataRecord).GetMethod("get_Item", new Type[] { typeof(int) }));
            // =======================================================================================================
            // Convertir el valor recuperado al tipo de destino
            // =======================================================================================================             
            if (info2.DataType == typeof(DateTime))
            {
              generator2.Emit(OpCodes.Unbox, typeof(DateTime));
              generator2.Emit(OpCodes.Ldstr, "dd/MM/yyyy HH:mm:ss.fff");
              parameterTypes = new Type[] { typeof(string) };
              generator2.Emit(OpCodes.Callvirt, typeof(DateTime).GetMethod("ToString", parameterTypes));
            }
            else
            {
              generator2.Emit(OpCodes.Unbox_Any, info2.DataType);
            }
            // =======================================================================================================
            // Declarar el campo destino
            // =======================================================================================================
            FieldBuilder field = builder.DefineField(info2.DestFieldName,
                                                     info2.DataType == typeof(DateTime) ? typeof(string)
                                                                                        : info2.DataType,
                                                     FieldAttributes.Public);
            generator2.Emit(OpCodes.Stfld, field);
            generator2.MarkLabel(label);
          }
          index++;
        }
      }
      return type;
    }

    /// <summary>
    /// Crea, o devuelve si ya se ha creado, un tipo dinámico con un constructor que acepta un parametro: 
    ///    - Entity
    /// </summary>
    /// <param name="sourceType">
    /// El tipo de origen. Debe heredar de Entity ya que se utiliza el DataProvider para obtener valores
    /// personalizados (propiedades que empiezan por "~") en este caso se invoca, si no es null, el delegado 
    /// Entity.GetExternalData y se le pasa (key, Entity) para devolver una cadena en consecuencia.
    /// </param>
    /// <param name="info">
    /// Datos sobre los campos del objeto a crear y las propiedades del objeto origen desde donde se obtienen.
    /// </param>
    /// <param name="key">Nombre del tipo a crear</param>
    /// <returns>
    /// El tipo creado.
    /// </returns>
    private static Type CreateType(Type sourceType, FieldInfo[] info, string key = "")
    {
      Type type;
      lock (_object)
      {
        // ===============================================================================================================================
        // Determinar qué nombre va a tener el tipo creado dinamicamente
        // ===============================================================================================================================
        string str = (key != "") ? string.Format("{0}_{1}", sourceType.Name, key) :
                                   string.Format("{0}_{1}", sourceType.FullName.Replace(".", "_"),
                                                            GetHash(info));
        if (_types.ContainsKey(str)) return _types[str];
        // =====================================================================================
        // Definición de la clase
        // =====================================================================================
        TypeBuilder builder = _moduleBuilder.DefineType(str,
                                                        TypeAttributes.BeforeFieldInit |
                                                        TypeAttributes.AutoClass |
                                                        //TypeAttributes.Serializable |
                                                        TypeAttributes.Public,
                                                        typeof(Negocio.Core.Entity));
        // =====================================================================================
        // Atributo XmlRootAttribute
        // =====================================================================================
        var __attrCtor = typeof(XmlRootAttribute).GetConstructor(new Type[] { typeof(string) });
        var __attrBuilder = new CustomAttributeBuilder(__attrCtor, new object[] { sourceType.Name });
        builder.SetCustomAttribute(__attrBuilder);
        // =====================================================================================
        // Definición del constructor sin parametros de la clase
        // =====================================================================================
        ILGenerator iLGenerator = builder.DefineConstructor(MethodAttributes.RTSpecialName |
                                                            MethodAttributes.SpecialName |
                                                            MethodAttributes.Public,
                                                            CallingConventions.Standard,
                                                            new Type[0])
                                          .GetILGenerator();
        iLGenerator.Emit(OpCodes.Ldarg_0);
        iLGenerator.Emit(OpCodes.Call, typeof(object).GetConstructor(new Type[0]));
        // =====================================================================================
        // Definición del constructor con parametros de la clase
        // =====================================================================================
        Type[] parameterTypes = new Type[] { sourceType };
        ILGenerator generator2 = builder.DefineConstructor(MethodAttributes.RTSpecialName |
                                                            MethodAttributes.SpecialName |
                                                            MethodAttributes.Public,
                                                            CallingConventions.Standard,
                                                            parameterTypes)
                                        .GetILGenerator();
        // =====================================================================================
        // Llamar al constructor de Object (MyBase.new())
        // =====================================================================================
        generator2.Emit(OpCodes.Ldarg_0);
        generator2.Emit(OpCodes.Call, typeof(object).GetConstructor(new Type[0]));
        // =====================================================================================
        // Declaración y carga de variables locales:
        // =====================================================================================
        generator2.DeclareLocal(sourceType);
        generator2.DeclareLocal(typeof(Entity.GetExternalData));
        generator2.DeclareLocal(typeof(int));
        // =====================================================================================
        // Hacer cast del objeto origen y almacenarlo
        // =====================================================================================
        generator2.Emit(OpCodes.Ldarg_1);
        generator2.Emit(OpCodes.Castclass, sourceType);
        generator2.Emit(OpCodes.Stloc_0);
        // =====================================================================================
        // Obtener el DataProvider del objeto origen y almacenarlo
        // =====================================================================================
        generator2.Emit(OpCodes.Ldloc_0);
        generator2.Emit(OpCodes.Castclass, typeof(Entity));
        generator2.Emit(OpCodes.Ldfld, sourceType.GetField("DataProvider"));
        generator2.Emit(OpCodes.Stloc_1);
        generator2.Emit(OpCodes.Ldloc_1);
        generator2.Emit(OpCodes.Ldnull);
        generator2.Emit(OpCodes.Ceq);
        generator2.Emit(OpCodes.Stloc_2);
        // =====================================================================================
        // Crear y llenar campos
        // =====================================================================================
        FieldInfo[] infoArray = info;
        int index = 0;
        while (true)
        {
          if (index >= infoArray.Length)
          {
            // ==================================================================
            // Salir del constructor
            // ==================================================================
            generator2.Emit(OpCodes.Ret);
            // ==================================================================
            // Crear el tipo y devolverlo
            // ==================================================================
            _types.Add(str, builder.CreateType());
            Trace.WriteLine("SmallXmlSerializer -> CreateDynamicType : " + str);
            type = _types[str];
            break;
          }

          FieldInfo info2 = infoArray[index];
          if (!info2.SourcePropertyName.StartsWith("~"))
          {
            // ==============================================================================
            // Valores desde la propiedad del objeto origen
            // ============================================================================== 
            FieldBuilder field = builder.DefineField(info2.DestFieldName,
                                                      info2.DataType,
                                                      FieldAttributes.Public);
            // ==============================================================================================
            // public abstract long Id { get; set; } esto es por si queremos hacer 
            // _values.Cast<Entity>()
            // ==============================================================================================
            if (index == 0 && info2.SourcePropertyName == "Id" && info2.DestFieldName != "Id" )
            {
              var property = builder.DefineProperty("Id", PropertyAttributes.HasDefault, typeof(long), null);
              var jsonIgnoreCtor = typeof(JsonIgnoreAttribute).GetConstructor(Type.EmptyTypes);
              var jsonIgnoreAttrBuilder = new CustomAttributeBuilder(jsonIgnoreCtor, new object[0]);
              property.SetCustomAttribute(jsonIgnoreAttrBuilder);

              var getMethodBuilder = builder.DefineMethod("get_Id",
                  MethodAttributes.Public | MethodAttributes.Virtual |
                  MethodAttributes.SpecialName | MethodAttributes.HideBySig,
                  typeof(long),
                  Type.EmptyTypes);
              var getIL = getMethodBuilder.GetILGenerator();
              getIL.Emit(OpCodes.Ldarg_0);
              getIL.Emit(OpCodes.Ldfld, field);
              getIL.Emit(OpCodes.Ret);
              property.SetGetMethod(getMethodBuilder);

              var setMethodBuilder = builder.DefineMethod("set_Id",
                  MethodAttributes.Public | MethodAttributes.Virtual | 
                  MethodAttributes.SpecialName | MethodAttributes.HideBySig,
                  null, // No retorna nada
                  new Type[] { typeof(long) });
              var setIL = setMethodBuilder.GetILGenerator();
              setIL.Emit(OpCodes.Ldarg_0);
              setIL.Emit(OpCodes.Ldarg_1);
              setIL.Emit(OpCodes.Stfld, field);
              setIL.Emit(OpCodes.Ret);
              property.SetSetMethod(setMethodBuilder);
            }

            generator2.Emit(OpCodes.Ldarg_0); // Destino
            generator2.Emit(OpCodes.Ldloc_0); // Origen 
            // ================================================================================
            // Intentar utilizar la propiedad
            // ================================================================================
            var __prop = sourceType.GetProperty(info2.SourcePropertyName,
                                                BindingFlags.Public |
                                                BindingFlags.Instance);
            if (__prop != null)
            {
              generator2.Emit(OpCodes.Callvirt, __prop.GetGetMethod());
              generator2.Emit(OpCodes.Stfld, field);
            }
            // ================================================================================
            // Utilizar el campo
            // ================================================================================
            else
            {
              generator2.Emit(OpCodes.Ldfld, sourceType.GetField(info2.SourcePropertyName,
                                                                 BindingFlags.Public |
                                                                 BindingFlags.Instance));
              generator2.Emit(OpCodes.Stfld, field);
            }
          }
          else
          {
            // ==============================================================================
            // Valores transformados/convertidos por la función proporcionada (DataProvider)
            // ==============================================================================
            Label label = generator2.DefineLabel();
            // =============================================================================
            // Si DataProvider is nothing no se invoca el delegado
            // =============================================================================
            generator2.Emit(OpCodes.Ldloc_2);
            generator2.Emit(OpCodes.Brtrue, label);
            // ==========================================================================================
            // Invocar el delegado para obtener el valor personalizado y almacenarlo en el campo destino
            // ==========================================================================================
            FieldBuilder field = builder.DefineField(info2.DestFieldName,
                                                      info2.DataType,
                                                      FieldAttributes.Public);
            generator2.Emit(OpCodes.Ldarg_0);                                          // Objeto destino
            generator2.Emit(OpCodes.Ldloc_1);                                          // Delegado 
            generator2.Emit(OpCodes.Ldstr, info2.SourcePropertyName.Replace("~", "")); // key
            generator2.Emit(OpCodes.Ldloc_0);                                          // ObjetoBase
            generator2.Emit(OpCodes.Callvirt, typeof(Entity.GetExternalData).GetMethod("Invoke"));
            // =====================================================================================
            // Convertir/formatear el valor
            // =====================================================================================           
            generator2.Emit(OpCodes.Unbox_Any, info2.DataType);

            generator2.Emit(OpCodes.Stfld, field);
            generator2.MarkLabel(label);
          }
          index++;
        }
      }
      return type;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="sourceType"></param>
    /// <param name="info"></param>
    /// <returns></returns>
    private static Type CreateSimpleType(Type sourceType, FieldInfo[] info)
    {

      lock (_object)
      {
        // ====================================================================================
        // Determinar qué nombre va a tener el tipo creado dinamicamente
        // ====================================================================================
        string key = string.Format("{0}_Simple_{1}",
                                   sourceType.FullName.Replace(".", "_"),
                                   GetHash(info));
        if (_types.ContainsKey(key)) return _types[key];
        // ==================================================================================
        // Definición de la clase
        // ==================================================================================
        TypeBuilder builder = _moduleBuilder.DefineType(key,
                                                        TypeAttributes.BeforeFieldInit |
                                                        TypeAttributes.AutoClass |
                                                        //TypeAttributes.Serializable    |
                                                        TypeAttributes.Public,
                                                        typeof(object));
        // =====================================================================================
        // Atributo XmlRootAttribute
        // =====================================================================================
        var __attrCtor = typeof(XmlRootAttribute).GetConstructor(new Type[] { typeof(string) });
        var __attrBuilder = new CustomAttributeBuilder(__attrCtor, new object[] { sourceType.Name });
        builder.SetCustomAttribute(__attrBuilder);
        // =====================================================================================
        // Definición del constructor sin parametros de la clase
        // =====================================================================================
        ILGenerator iLGenerator1 = builder.DefineConstructor(MethodAttributes.RTSpecialName |
                                                             MethodAttributes.SpecialName |
                                                             MethodAttributes.Public,
                                                             CallingConventions.Standard,
                                                             new Type[0])
                                          .GetILGenerator();
        iLGenerator1.Emit(OpCodes.Ldarg_0);
        iLGenerator1.Emit(OpCodes.Call, typeof(object).GetConstructor(new Type[0]));
        // ==================================================================================
        // Definición del constructor con parametros de la clase
        // ==================================================================================
        Type[] parameterTypes = new Type[] { sourceType };
        ILGenerator iLGenerator = builder.DefineConstructor(MethodAttributes.RTSpecialName |
                                                            MethodAttributes.SpecialName |
                                                            MethodAttributes.Public,
                                                            CallingConventions.Standard,
                                                            parameterTypes)
                                         .GetILGenerator();
        // ==================================================================================
        // Llamar al constructor de Object (MyBase.new())
        // ==================================================================================          
        iLGenerator.Emit(OpCodes.Ldarg_0);
        iLGenerator.Emit(OpCodes.Call, typeof(object).GetConstructor(new Type[0]));
        // ==================================================================================
        // Hacer cast del objeto origen y almacenarlo
        // ==================================================================================
        iLGenerator.DeclareLocal(sourceType);
        iLGenerator.Emit(OpCodes.Ldarg_1);
        if (sourceType.IsClass)
          iLGenerator.Emit(OpCodes.Castclass, sourceType);
        else
          iLGenerator.Emit(OpCodes.Box, sourceType);
        iLGenerator.Emit(OpCodes.Stloc_0);
        // ===================================================================================
        // Crear y llenar campos
        // ===================================================================================
        FieldInfo[] infoArray = info;
        int index = 0;
        while (true)
        {
          if (index >= infoArray.Length)
          {
            // ==============================================================================
            // Salir del constructor
            // ==============================================================================
            iLGenerator.Emit(OpCodes.Ret);
            // ==============================================================================
            // Crear el tipo y devolverlo
            // ==============================================================================
            _types.Add(key, builder.CreateType());
            Trace.WriteLine("SmallXmlSerializer -> CreateDynamicType (Simple) : " + key);
            break;
          }
          FieldInfo info2 = infoArray[index];
          FieldBuilder field = builder.DefineField(info2.DestFieldName,
                                                   info2.DataType,
                                                   FieldAttributes.Public);
          iLGenerator.Emit(OpCodes.Ldarg_0);
          iLGenerator.Emit(OpCodes.Ldloc_0);
          // ================================================================================
          // Intentar utilizar la propiedad
          // ================================================================================
          var __property = sourceType.GetProperty(info2.SourcePropertyName,
                                                  BindingFlags.Public |
                                                  BindingFlags.Instance);
          if (__property != null)
          {
            iLGenerator.Emit(OpCodes.Callvirt, __property.GetGetMethod());
            iLGenerator.Emit(OpCodes.Stfld, field);
            index++;
            continue;
          }
          // ================================================================================
          // Utilizar el campo
          // ================================================================================
          iLGenerator.Emit(OpCodes.Ldfld, sourceType.GetField(info2.SourcePropertyName,
                                                              BindingFlags.Public |
                                                              BindingFlags.Instance));
          iLGenerator.Emit(OpCodes.Stfld, field);
          index++;
        }
        return _types[key];
      }
    }

    /// <summary>
    /// Obtener un valor único para identificar un tipo creado dinámicaments
    /// </summary>
    /// <param name="info">Información sobre las propiedades o campos del objeto destino que se deserializa.</param>
    /// <returns></returns>
    private static string GetHash(FieldInfo[] info)
    {
      var builder = new StringBuilder();
      foreach (FieldInfo fieldInfo in info)
      {
        builder.Append(fieldInfo.SourcePropertyName + fieldInfo.DestFieldName);
      }
      return Math.Abs(builder.ToString().GetHashCode()).ToString("00000000000000");
    }

    /// <summary>
    /// Recuperar los objetos que se van a serializar. Dependiendo del estado del
    /// serializador esta función puede devolver o la colección de objetos origen o la
    /// colección de objetos destino creados dinámicamente.
    /// </summary>
    /// <returns>
    /// Colección de objetos del tipo origen o destino si se ya se hn creado las instancias
    /// de estos últimos.
    /// </returns>
    public IList GetValues() => _values;

    /// <summary>
    /// Establece la colección de objetos origen para utilizarlos en la serialización.
    /// </summary>
    /// <param name="values">Colección de objetos oigen.</param>
    /// <param name="createObjects">Especifica si es necesario crear e inicializar los objetos destino.</param>
    /// <returns></returns>
    public SmallXmlSerializer Use(IList values, bool createObjects = true)
    {
      _values = values;
      _createObjects = createObjects;
      return this;
    }

    /// <summary>
    /// Obtener la serialización de los valores en formato JSON.
    /// </summary>
    /// <param name="associativeArray">
    /// Indica si el formato de la cadena devuelta es un diccionario javaScript. 
    /// Si los objetos origen no heredan de Entity y este parámetro es true se producirá 
    /// una excepción al no poder convertir el objeto.
    /// </param>
    /// <returns>Una cadena de texto con los datos serializados.</returns>
    public string ToJsonString(bool associativeArray = false)
    {
      if (_createObjects) CreateAndFillObjects();
      return Serialize(associativeArray ? _values.Cast<Entity>().ToDictionary(e => e.Id, e => (object)e)
                                        : _values);
    }

    private IDictionary<long, object> ToDictionaryConReflexion()
    {
      var res = new Dictionary<long, object>();
      if (_values == null || _values.Count == 0) return res;
      var propertyInfo = _values[0].GetType().GetProperty("Id", BindingFlags.Public | BindingFlags.Instance);
      if (propertyInfo == null) return res;     
      foreach (var item in _values) {
        res[Convert.ToInt64(propertyInfo.GetValue(item))] = item;
      }
      return res;
    }


    /// <summary>
    /// Obtener la serialización de un objeto en formato JSON.
    /// </summary>
    /// <param name="value">Objeto que se quiere serializar.</param>
    /// <param name="createObject">
    /// Si este valor es true se creará e inicializará una 
    /// instancia del objeto destino indicado en la creación del serializador.
    /// </param>
    /// <returns></returns>
    public string ToJsonString(object value, bool createObject = false)
    {
      var __target = createObject ? Activator.CreateInstance(_targetType, new object[] { value })
                                  : value;
      return Serialize(__target);
    }

    /// <summary>
    /// Método encargado de crear e inicializar las instancias de los objetos destino correspondientes
    /// </summary>
    public SmallXmlSerializer CreateAndFillObjects()
    {
      if (!_createObjects) return this;
      _values = _values.Cast<object>()
                .Select(o => Activator.CreateInstance(_targetType, new object[] { o }))
                .ToList();
      _createObjects = false;
      return this;
    }

    /// <summary>
    /// Realizar la serialización de un objeto.
    /// </summary>
    /// <param name="target">Objeto que se quiere serializar.</param>
    /// <returns></returns>
    private static string Serialize(object target)
    {
      return JsonSerializer.Serialize(target,
                                      new JsonSerializerOptions()
                                      {
                                        IncludeFields = true,
                                        WriteIndented = true
                                      });
    }

    private static string ToCamelCase(string s)
    {
      if (string.IsNullOrEmpty(s) || s.Length < 2) return s;
      if (char.IsLower(s[0])) return s;
      return char.ToLower(s[0]) + s[1..];
    }

  }

}
