
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Negocio.Core
{
  /// <summary>
  /// Función que se invoca, desde SqlDirectQuery para obtener un valor que se debe serializar pero que no se encuentra entre los
  /// campos devueltos por la sentencia SQL de selección de registros. Esta función se invoca tantas veces como
  /// registros devuelva la sentencia SQL.
  /// </summary>
  /// <param name="key">Nombre o clave del valor o campo.</param>
  /// <param name="reader">El dataReader que se está recorriendo.</param>
  /// <returns></returns>
  public delegate object ExtensionPoint(string key, IDataRecord reader);

  /// <summary>
  /// Repositorio de serializadores cargados desde ficheros de texto plano.
  /// </summary>
  public static class SerializersStringRepository
  {
    private static readonly Dictionary<string, string> _values = new Dictionary<string, string>();
    private static readonly Dictionary<string, string> _types = new Dictionary<string, string>();
    private static readonly Dictionary<string, string> _modes = new Dictionary<string, string>();

    /// <summary>
    /// Contructor privado para cargar la configuración de los serializadores desde los ficheros de texto
    /// plano incluidos como recursos incrustados en el ensamblado.
    /// </summary>
    static SerializersStringRepository()
    {
      Trace.WriteLine("");
      Trace.WriteLine("============================================================================================");
      Trace.WriteLine(@"  _____           _       _ _                  ");
      Trace.WriteLine(@" /  ___|         (_)     | (_)                 ");
      Trace.WriteLine(@" \ `--.  ___ _ __ _  __ _| |_ _______ _ __ ___ ");
      Trace.WriteLine(@"  `--. \/ _ \ '__| |/ _` | | |_  / _ \ '__/ __|");
      Trace.WriteLine(@" /\__/ /  __/ |  | | (_| | | |/ /  __/ |  \__ \");
      Trace.WriteLine(@" \____/ \___|_|  |_|\__,_|_|_/___\___|_|  |___/");
      Trace.WriteLine("============================================================================================");
      Trace.WriteLine("Loading serializers");
      Trace.WriteLine("============================================================================================");
      string[] __resourceNames = Assembly.GetExecutingAssembly()
                                         .GetManifestResourceNames()
                                         .Where(name => name.ToLower().EndsWith(".serializers.txt"))
                                         .OrderBy(e => e.ToLower())
                                         .ToArray();
      // ===========================================================================================================
      // Cargar todos los ficheros de configuración de
      // ===========================================================================================================
      foreach (string name in __resourceNames) ReadFile(name);
      // ===========================================================================================================
      // Trazas
      // ===========================================================================================================      
      Array.ForEach(_types.Where(p => p.Value != "").ToArray(), p => Trace.WriteLine(p.Key + "@" + p.Value));
      Array.ForEach(_modes.Where(p => p.Value != "").ToArray(), p => Trace.WriteLine(p.Key + "@" + p.Value));
      Trace.WriteLine("============================================================================================");
      Trace.WriteLine(string.Format("Serializers -> {0} items loaded", _values.Count));
      Trace.WriteLine("============================================================================================");
    }

    /// <summary>
    /// Procesar y añadir a la configuración los serializadores especificados en el fichero.
    /// </summary>
    /// <param name="name">Nombre del fichero incluido como recurso en el ensamblado.</param>
    private static void ReadFile(string name)
    {
      Trace.WriteLine(string.Format("Serializers.file -> {0}", name));
      using (StreamReader reader = new StreamReader(Assembly.GetExecutingAssembly()
                                                            .GetManifestResourceStream(name)))
      {
        string key = "";
        StringBuilder builder = new StringBuilder();
        List<string[]> alias = new List<string[]>();
        while (true)
        {
          if (reader.Peek() == -1)
          {
            _values.Add(key, builder.ToString().Trim());
            Trace.WriteLine("  " + key + " = " + _values[key]);
            break;
          }
          string __line = reader.ReadLine();
          if (__line.Trim().Length == 0) continue;
          if (__line.Trim().StartsWith(";")) continue;
          if (__line.Trim().StartsWith("--")) continue;
          // ==============================================================================================
          // SET Name@Negocio.Persona@Simple|Entity = refName
          // ==============================================================================================
          if (__line.Trim().StartsWith("SET"))
          {
            string[] __tokens = __line.Replace("SET ", "").Split("=");
            string __refName = __tokens[1].Trim();
            __tokens = __tokens[0].Trim()
                                  .Split(new char[] { '@' }, 
                                         System.StringSplitOptions.RemoveEmptyEntries);
            var __name = __tokens[0].Trim();
            var __typeName = __tokens.Length > 1 ? __tokens[1].Trim() : "";
            var __mode = __tokens.Length > 2 ? __tokens[2].Trim() : "";
            alias.Add(new string[] {__name, __refName, __typeName, __mode });
            continue;
          }

          if (__line.Trim().StartsWith("#"))
          {
            if (key.Length > 0)
            {
              _values.Add(key, builder.ToString().Trim());
              Trace.WriteLine("  " + key + " = " + _values[key]);
            } 
            // ==============================================================================================
            // Es posible indicar el tipo asociado al serializador: #Nombre@Negocio.Persona@Simple|Entity
            // ==============================================================================================
            string[] tokens = __line.Substring(1)
                                    .Split(new char[] { '@' }, 
                                           System.StringSplitOptions.RemoveEmptyEntries);
            key = tokens[0].Trim();
            _types.Add(key, tokens.Length > 1 ? tokens[1].Trim() : "");
            _modes.Add(key, tokens.Length > 2 ? tokens[2].Trim() : "");
            builder.Length = 0;
          }
          else
          {
            builder.Append(__line.Trim());
          }
        }
        foreach (string[] item in alias)
        {
          string __name = item[0];
          _values.Add(__name, _values[item[1]]);
          Trace.WriteLine("  " + __name + " = " + _values[key]);
          _types.Add(__name, item[2]);
          _modes.Add(__name, item[3]);
          Trace.WriteLine("Alias -> " + string.Format("{0,-40} = {1}", item[0], item[1]));
        }
      }
    }

    /// <summary>
    /// Inicializa un serializador a partir de los valores configuradados para el nombre dado.
    /// </summary>
    /// <param name="name">Nombre o clave del serializador en alguno de los ficheros *.Serializrs.txt.</param>
    /// <param name="values">Elementos que se quieren serializar.</param>
    /// <returns>
    /// Un objeto SmallXmlSerializer inicializado.
    /// </returns>
    public static SmallXmlSerializer GetNamedSerializer(string name, System.Collections.IList values = null)
    {
      var __type = Type.GetType(SerializersStringRepository.TypeNameFromKey(name));
      var __fieldInfo = FieldInfo.FromString(SerializersStringRepository.ValueFromKey(name));
      var __simple = SerializersStringRepository.ModeFromKey(name) == "Simple";
      return new SmallXmlSerializer(__type, __fieldInfo, values, __simple);
    }

    /// <summary>
    /// Recuperar desde la configuración la información sobre los campos que se deben serializar.
    /// </summary>
    /// <param name="key">Nombre o clave del serializador en alguno de los ficheros *.Serializrs.txt.</param>
    /// <returns>
    /// Una cadena de texto con la información de los campos por serializar.
    /// </returns>
    public static string ValueFromKey(string key)
    {
      return _values[key];
    }

    /// <summary>
    /// Recuperar desde la configuración el nombre del objeto origen.
    /// </summary>
    /// <param name="key">Nombre o clave del serializador en alguno de los ficheros *.Serializrs.txt.</param>
    /// <returns>
    /// Una cadena de texto con la información del tipo del objeto origen.
    /// </returns>
    public static string TypeNameFromKey(string key)
    {
      return _types[key];
    }

    /// <summary>
    /// Recuperar desde la configuración la información sobre el tipo de objeto origen.
    /// </summary>
    /// <param name="key">Nombre o clave del serializador en alguno de los ficheros *.Serializrs.txt.</param>
    /// <returns>
    /// Una cadena de texto con el tipo de objeto origen: Simple o Entity si el tipo hereda de la entidad base
    /// para los objetos de negocio.
    /// </returns>
    public static string ModeFromKey(string key)
    {
      return _modes[key];
    }
  }
}
