using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.Reflection;
using System.Reflection.Emit;

namespace Dal.Core.Loader
{

  /// <summary>
  /// Clase que agrupa métodos estáticos relacionados con la carga de datos desde una tabla de base de datos 
  /// a las propiedades o campos de un objeto
  /// </summary>
  public class Loader
  {

    /// <summary>
    /// Tipo de las funciones utilizadas para cargar un objeto.
    /// </summary>
    /// <typeparam name="T">Tipo del objeto a cargar.</typeparam>
    /// <param name="target">Instancia sobre la que se realiza la carga o asignación de datos.</param>
    /// <param name="dr">DataReader del que se recuperan los valores.</param>
    /// <returns>
    /// La instancia con los valores de sus propiedades cargados.
    /// </returns>
    private delegate T FillObjectDelegate<T>(T target, IDataReader dr);

    /// <summary>
    /// Tipo de las funciones utilizadas para creación y carga de una colección de objetos.
    /// </summary>
    /// <typeparam name="T">Tipo del objeto a cargar.</typeparam>
    /// <param name="dr">IDataReader del que se recuperan los valores.</param>
    /// <param name="context">
    /// Contexto de base de datos utilizado. 
    /// Este contexto de base de datos se asigna a todos y cada uno de los objetos creados.
    /// </param>
    /// <returns></returns>
    private delegate T FillObjectsDelegate<T>(IDataReader dr, DbContext context);


    /// <summary>
    /// Constructor privado de la clase
    /// </summary>
    private Loader()
    {
    }

    /// <summary>
    /// Carga los valores de los campos de una tabla en las propiedades de un objeto.
    /// </summary>
    /// <typeparam name="T">Tipo del objeto que se va a cargar.</typeparam>
    /// <param name="target">Instancia sobre la que se realiza la carga de datos.</param>
    /// <param name="dr">IDataReader del que se recuperan los valores.</param>
    /// <param name="binder">Enlazador o cargador que se debe utilizar.</param>
    internal static void LoadObject<T>(T target, IDataReader dr, EntityBinder binder) where T : class, new()
    {
      using (dr)
      {
        if (dr.Read()) PopulateObject<T>(target, dr, binder);
      }
    }

    /// <summary>
    /// Carga los valores de los campos de una tabla en las propiedades de una coleción de objetos.
    /// </summary>
    /// <typeparam name="T">Tipo de los objetos que se va a cargar.</typeparam>
    /// <param name="target">Colección a la que se añadirán los elementos creados y cargados.</param>
    /// <param name="dr">IDataReader del que se recuperan los valores.</param>
    /// <param name="binder">Enlazador o cargador que se debe utilizar.</param>
    /// <param name="context">
    /// Contexto de base de datos utilizado. 
    /// Este contexto de base de datos se asigna a todos y cada uno de los objetos creados.
    /// </param>
    /// <returns>La colección proporcionada con los elementos cargados.</returns>
    internal static Collection<T> LoadObjects<T>(Collection<T> target, IDataReader dr, EntityBinder binder, DbContext context) where T : class, new()
    {
      LoadObjects((IList<T>)target, dr, binder, context);
      return target;
    }

    /// <summary>
    /// Carga los valores de los campos de una tabla en las propiedades de una lista de objetos.
    /// </summary>
    /// <typeparam name="T">Tipo de los objetos que se va a cargar.</typeparam>
    /// <param name="target">Lista a la que se añadirán los elementos creados y cargados.</param>
    /// <param name="dr">IDataReader del que se recuperan los valores.</param>
    /// <param name="binder">Enlazador o cargador que se debe utilizar.</param>
    /// <param name="context">
    /// Contexto de base de datos utilizado. 
    /// Este contexto de base de datos se asigna a todos y cada uno de los objetos creados.
    /// </param>
    /// <returns>La lista proporcionada con los elementos cargados.</returns>
    internal static IList<T> LoadObjects<T>(IList<T> target, IDataReader dr, EntityBinder binder, DbContext context) where T : class, new()
    {
      using (dr)
      {
        if (binder.FillObjectsDelegate == null) binder.FillObjectsDelegate = MakeFillObjectsDelegate<T>(binder);
        FillObjectsDelegate<T> fillObjectsDelegate = (FillObjectsDelegate<T>)binder.FillObjectsDelegate;
        while (dr.Read())
          target.Add(fillObjectsDelegate(dr, context));
        return target;
      }
    }

    /// <summary>
    /// Carga los valores de los campos de una tabla en las propiedades de un objeto.
    /// </summary>
    /// <typeparam name="T">Tipo del objeto que se va a cargar.</typeparam>
    /// <param name="target">Instancia sobre la que se realiza la carga de datos.</param>
    /// <param name="dr">IDataReader del que se recuperan los valores.</param>
    /// <param name="binder">Enlazador o cargador que se debe utilizar.</param>
    /// <returns></returns>
    private static T PopulateObject<T>(T target, IDataReader dr, EntityBinder binder) where T : class, new()
    {
      using (dr)
      {
        if (binder.FillObjectDelegate == null)
        {
          binder.FillObjectDelegate = MakeFillObjectDelegate<T>(binder);
        }
        ((FillObjectDelegate<T>)binder.FillObjectDelegate)(target, dr);
        return target;
      }      
    }

    /// <summary>
    /// Crea en tiempo de ejecución un método dinámico encargado de realizar la carga de las propiedades 
    /// de un objeto desde los valores de un DataReader.
    /// </summary>
    /// <typeparam name="T">Tipo del objeto que se va a cargar.</typeparam>
    /// <param name="binder">Enlazador o cargador que se debe utilizar.</param>
    /// <returns>Un delegado para realizar la carga del tipo de objeto.</returns>
    private static FillObjectDelegate<T> MakeFillObjectDelegate<T>(EntityBinder binder)
    {
      System.Type[] parameterTypes = new System.Type[] { typeof(T), typeof(IDataRecord) };
      DynamicMethod method = new DynamicMethod("", typeof(T), parameterTypes, typeof(T), true);
      ILGenerator iLGenerator = method.GetILGenerator();
      using (List<BindItem>.Enumerator enumerator = binder.BindItems().GetEnumerator())
      {
        while (true)
        {
          if (!enumerator.MoveNext())
          {
            break;
          }
          BindItem current = enumerator.Current;
          Label label = iLGenerator.DefineLabel();
          iLGenerator.Emit(OpCodes.Ldarg_1);
          iLGenerator.Emit(OpCodes.Ldc_I4, current.DbIndex);
          iLGenerator.Emit(OpCodes.Callvirt, typeof(IDataRecord).GetMethod("IsDBNull"));
          iLGenerator.Emit(OpCodes.Brtrue, label);
          iLGenerator.Emit(OpCodes.Ldarg_0);
          iLGenerator.Emit(OpCodes.Ldarg_1);
          iLGenerator.Emit(OpCodes.Ldc_I4, current.DbIndex);
          parameterTypes = new System.Type[] { typeof(int) };
          iLGenerator.Emit(OpCodes.Callvirt, typeof(IDataRecord).GetMethod("get_Item", parameterTypes));
          // =====================================================================================
          // Convertir/formatear el valor
          // =====================================================================================
          if (current.DbType == typeof(BinderName)) // Esto es para marcar DateTime
          {
            iLGenerator.Emit(OpCodes.Unbox_Any, typeof(System.DateTime));
          }
          else if (current.DbType == typeof(DateTime))
          {
            iLGenerator.Emit(OpCodes.Unbox, typeof(System.DateTime));
            iLGenerator.Emit(OpCodes.Ldstr, "dd/MM/yyyy HH:mm:ss.fff");
            parameterTypes = new System.Type[] { typeof(string) };
            iLGenerator.Emit(OpCodes.Callvirt, typeof(System.DateTime).GetMethod("ToString", parameterTypes));
          }
          else
          {
            iLGenerator.Emit(OpCodes.Unbox_Any, current.DbType);
          }
          iLGenerator.Emit(OpCodes.Stfld, typeof(T).GetField(current.DomainFieldName, 
                                                             BindingFlags.NonPublic |
                                                             BindingFlags.Public    |
                                                             BindingFlags.Instance  | 
                                                             BindingFlags.IgnoreCase));
          iLGenerator.MarkLabel(label);
        }
      }
      iLGenerator.Emit(OpCodes.Ldarg_0);
      iLGenerator.Emit(OpCodes.Ret);
      return (FillObjectDelegate<T>)method.CreateDelegate(typeof(FillObjectDelegate<T>));
    }

    /// <summary>
    /// Crea, en tiempo de ejecución, un método dinámico encargado de crear un objeto y cargar los valores de su propiedades 
    /// con los valores de un DataReader. Este método también asigna el contexto de base de datos si el 
    /// objeto tiene una propiedad llamada "DataContext" de tipo <see cref="DbContext"/>
    /// </summary>
    /// <typeparam name="T">Tipo del objeto que se va a crear y cargar.</typeparam>
    /// <param name="binder">Enlazador o cargador que se debe utilizar.</param>
    /// <returns>Un delegado para realizar la creación y carga de un objeto.</returns>
    private static FillObjectsDelegate<T> MakeFillObjectsDelegate<T>(EntityBinder binder)
    {
      System.Type[] parameterTypes = new System.Type[] { typeof(IDataRecord), typeof(DbContext) };
      DynamicMethod method = new DynamicMethod("", typeof(T), parameterTypes, typeof(T), true);
      ILGenerator iLGenerator = method.GetILGenerator();
      iLGenerator.DeclareLocal(typeof(T));
      iLGenerator.Emit(OpCodes.Newobj, typeof(T).GetConstructor(System.Type.EmptyTypes));
      iLGenerator.Emit(OpCodes.Stloc_0);
      using (List<BindItem>.Enumerator enumerator = binder.BindItems().GetEnumerator())
      {
        while (true)
        {
          if (!enumerator.MoveNext())
          {
            break;
          }
          BindItem current = enumerator.Current;
          Label label = iLGenerator.DefineLabel();
          iLGenerator.Emit(OpCodes.Ldarg_0);
          iLGenerator.Emit(OpCodes.Ldc_I4, current.DbIndex);
          iLGenerator.Emit(OpCodes.Callvirt, typeof(IDataRecord).GetMethod("IsDBNull"));
          iLGenerator.Emit(OpCodes.Brtrue, label);
          iLGenerator.Emit(OpCodes.Ldloc_0);
          iLGenerator.Emit(OpCodes.Ldarg_0);
          iLGenerator.Emit(OpCodes.Ldc_I4, current.DbIndex);
          parameterTypes = new System.Type[] { typeof(int) };
          iLGenerator.Emit(OpCodes.Callvirt, typeof(IDataRecord).GetMethod("get_Item", parameterTypes));
          // =====================================================================================
          // Convertir/formatear el valor
          // =====================================================================================           
          if (current.DbType == typeof(BinderName)) // Esto es para marcar DateTime
          {
            iLGenerator.Emit(OpCodes.Unbox_Any, typeof(System.DateTime));
          }
          else if (current.DbType == typeof(DateTime))
          {
            iLGenerator.Emit(OpCodes.Unbox, typeof(System.DateTime));
            iLGenerator.Emit(OpCodes.Ldstr, "dd/MM/yyyy HH:mm:ss.fff");
            parameterTypes = new System.Type[] { typeof(string) };
            iLGenerator.Emit(OpCodes.Callvirt, typeof(System.DateTime).GetMethod("ToString", parameterTypes));
          }
          else
          {
            iLGenerator.Emit(OpCodes.Unbox_Any, current.DbType);
          }
          iLGenerator.Emit(OpCodes.Stfld, typeof(T).GetField(current.DomainFieldName, 
                                                             BindingFlags.NonPublic |
                                                             BindingFlags.Public    |
                                                             BindingFlags.Instance  | 
                                                             BindingFlags.IgnoreCase));
          iLGenerator.MarkLabel(label);
        }
      }
      // ============================================================================================
      // Comprobar si el objeto hereda de EntityBase o tiene una propiedad DataContext
      // ============================================================================================
      var __prop = typeof(T).GetProperty("DataContext",
                                          BindingFlags.Public |
                                          BindingFlags.Instance |
                                          BindingFlags.IgnoreCase);
      if(__prop is not null)
      {
        iLGenerator.Emit(OpCodes.Ldloc_0);
        iLGenerator.Emit(OpCodes.Ldarg_1);
        iLGenerator.Emit(OpCodes.Callvirt, __prop.GetSetMethod());
      }
      iLGenerator.Emit(OpCodes.Ldloc_0);
      iLGenerator.Emit(OpCodes.Ret);
      return (FillObjectsDelegate<T>)method.CreateDelegate(typeof(FillObjectsDelegate<T>));
    }

  }
}
