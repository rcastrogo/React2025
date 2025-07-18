
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

namespace Dal.Core.Loader
{

  /// <summary>
  /// Clase que contiene utilidades para la obtención de cargadores y sentencias SQL con nombre. 
  /// Estos cargadores y sentencias SQL se definen en ficheros de texto incluidos en el ensamblado como
  /// recursos incrustados. Tienen los nombres *.Queries.txt y *.Binders.txt
  /// </summary>
  public class MetaDataManager
  {
    private static readonly object _object = new object();

    /// <summary>
    /// Repositorio de cargadores.
    /// </summary>
    private static readonly NamedBindersContainer _metaDataContainer = null;

    /// <summary>
    /// Repositorio de sentenias SQL con nombre.
    /// </summary>
    private static readonly NamedQueryContainer _queryContainer = null;

    /// <summary>
    /// Constructor estático de la clase que inicializa los repositorios de cargadores y de sentencias SQL.
    /// </summary>
    static MetaDataManager()
    {
      _metaDataContainer = new NamedBindersContainer();
      _queryContainer = new NamedQueryContainer();
    }

    /// <summary>
    /// Recupera la cadena de texto con la definición de un cargador.
    /// </summary>
    /// <param name="name">Nombre del cargador</param>
    /// <returns>Una cadena de texto con la definición del cargador.</returns>
    public static string GetNamedBinder(string name)
    {
      return _metaDataContainer[name];
    }

    /// <summary>
    /// Recupera la sentencia SQL asociada a una clave o nombre.
    /// </summary>
    /// <param name="name">Nombre o clave de la sentencia SQL.</param>
    /// <returns></returns>
    public static string GetNamedQuery(string name)
    {
      return _queryContainer[name];
    }

    /// <summary>
    /// Repositorio de cargadores a los que es posible acceder por su nombre o clave.
    /// </summary>
    private class NamedBindersContainer
    {

      private Dictionary<string, string> _descriptions = new Dictionary<string, string>();

      /// <summary>
      /// Inicializa una instancia de la clase. Para ello busca los ficheros de texto (*.binders.txt)
      /// incluidos como recursos incrustados en el ensamblado y los procesa.
      /// </summary>
      public NamedBindersContainer()
      {
        Trace.WriteLine("");
        Trace.WriteLine("============================================================================================");
        Trace.WriteLine(@" _   _                                  _   ______   _               _                     ");
        Trace.WriteLine(@"| \ | |                                | |  | ___ \ (_)             | |                    ");
        Trace.WriteLine(@"|  \| |   __ _   _ __ ___     ___    __| |  | |_/ /  _   _ __     __| |   ___   _ __   ___ ");
        Trace.WriteLine(@"| . ` |  / _` | | '_ ` _ \   / _ \  / _` |  | ___ \ | | | '_ \   / _` |  / _ \ | '__| / __|");
        Trace.WriteLine(@"| |\  | | (_| | | | | | | | |  __/ | (_| |  | |_/ / | | | | | | | (_| | |  __/ | |    \__ \");
        Trace.WriteLine(@"\ | \_/  \__,_| |_| |_| |_|  \___|  \__,_|  \____/  |_| |_| |_|  \__,_|  \___| |_|    |___/");
        Trace.WriteLine("============================================================================================");
        Trace.WriteLine("Loading named binders");
        Trace.WriteLine("============================================================================================");
        // =============================================================================================================
        // Procesar todos los ficheros con extensión .binders.txt
        // =============================================================================================================
        string[] __resourceNames = Assembly.GetExecutingAssembly()
                                           .GetManifestResourceNames()
                                           .Where(name => name.ToLower()
                                                              .EndsWith(".binders.txt"))
                                           .OrderBy( e => e.ToLower() )
                                           .ToArray();
        foreach ( string name in __resourceNames)
        {
          ReadFile(name);    
        }        
        Trace.WriteLine("============================================================================================");
        Trace.WriteLine(string.Format("Binders -> {0} named binders loaded", _descriptions.Count));
        Trace.WriteLine("============================================================================================");
      }

      /// <summary>
      /// Procesa la información sobre los cargadores incluida en un fichero de texto determinado.
      /// </summary>
      /// <param name="name">Nombre del fichero de texto incluido como recurso incrustado en el ensamblado.</param>
      private void ReadFile(string name)
      {
        Trace.WriteLine(string.Format("Binders.file -> {0}", name));
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
              _descriptions.Add(key, builder.ToString().Trim());
              Trace.WriteLine("  " + key + " = " + _descriptions[key]);
              break;
            }
            string __line = reader.ReadLine();
            if (__line.Trim().Length == 0) continue;
            if (__line.Trim().StartsWith(";")) continue;
            if (__line.Trim().StartsWith("--")) continue;
            if (__line.Trim().StartsWith("SET"))
            {
              string[] __tokens = __line.Replace("SET ", "").Split("=");
              alias.Add(new string[] { __tokens[0].Trim(), __tokens[1].Trim() });
              continue;
            }
            if (!__line.Trim().StartsWith("#"))
            {
              if (builder.Length > 0)
              {
                builder.Append(';');
              }
              builder.Append(new Regex(@"\s*,").Replace(__line.Trim(), ","));
              continue;
            }
            if (key.Length > 0)
            {
              _descriptions.Add(key, builder.ToString().Trim());
              Trace.WriteLine("  " + key + " = " + _descriptions[key]);
            }
            key = __line.Substring(1);
            builder.Length = 0;
          }
          foreach (string[] item in alias)
          {
            _descriptions.Add(item[0], _descriptions[item[1]]);
            Trace.WriteLine("  Alias -> " + string.Format("{0,-40} = {1}", item[0], item[1]));
          }
        }
      }

      /// <summary>
      /// Obtiene la definición de un cargador determinado.
      /// </summary>
      /// <param name="name">Nombre o clave del cargador.</param>
      /// <returns></returns>
      public string this[string name]
      {
        get
        {
          return _descriptions[name];
        }
      }

      /// <summary>
      /// Obtiene un array de cadenas con las claves o nombres de los cargadores en el repositorio.
      /// </summary>
      public string[] Keys
      {
        get
        {
          return Enumerable.ToArray<string>(_descriptions.Keys);
        }
      }
    }

    /// <summary>
    /// Repositorio de sentencias SQL a las que es posible acceder por su nombre o clave.
    /// </summary>
    private class NamedQueryContainer
    {
      private Dictionary<string, string> _querys = new Dictionary<string, string>();

      /// <summary>
      /// Inicializa una instancia de la clase. Busca los ficheros de texto (*.queries.txt) con la 
      /// definición de sentencias SQL y los procesa.
      /// </summary>
      public NamedQueryContainer()
      {
        Trace.WriteLine("");
        Trace.WriteLine("===========================================================================================");
        Trace.WriteLine(@" _   _                                  _    _____                         _              ");
        Trace.WriteLine(@"| \ | |                                | |  |  _  |                       (_)             ");
        Trace.WriteLine(@"|  \| |   __ _   _ __ ___     ___    __| |  | | | |  _   _    ___   _ __   _    ___   ___ ");
        Trace.WriteLine(@"| . ` |  / _` | | '_ ` _ \   / _ \  / _` |  | | | | | | | |  / _ \ | '__| | |  / _ \ / __|");
        Trace.WriteLine(@"| |\  | | (_| | | | | | | | |  __/ | (_| |  \ \/' / | |_| | |  __/ | |    | | |  __/ \__ \");
        Trace.WriteLine(@"\_| \_/  \__,_| |_| |_| |_|  \___|  \__,_|   \_/\_\  \__,_|  \___| |_|    |_|  \___| |___/");
        Trace.WriteLine("===========================================================================================");
        Trace.WriteLine("Loading named querys");
        Trace.WriteLine("===========================================================================================");
        string[] __resourceNames = Assembly.GetExecutingAssembly()
                                           .GetManifestResourceNames()
                                           .Where(name => name.ToLower()
                                                              .EndsWith(".queries.txt"))
                                           .OrderBy( e => e.ToLower() )
                                           .ToArray();

        foreach ( string name in __resourceNames)
        {
          ReadFile(name);    
        }
        Trace.WriteLine("===========================================================================================");
        Trace.WriteLine(string.Format("Queries -> {0} named querys loaded", _querys.Count));
        Trace.WriteLine("===========================================================================================");
      }

      /// <summary>
      /// Procesa la información sobre las sentencias SQL incluida en un fichero de texto determinado.
      /// </summary>
      /// <param name="name">Nombre del fichero de texto incluido como recurso incrustado en el ensamblado.</param>
      private void ReadFile(string name)
      {
        Trace.WriteLine(string.Format("Queries.file -> {0}", name));
        using (StreamReader reader = new StreamReader(Assembly.GetExecutingAssembly()
                                                              .GetManifestResourceStream(name)))
        {
          Multiline __multiLine = new Multiline();
          while (true)
          {
            if (reader.Peek() == -1) break;
            string __line = reader.ReadLine().Trim();
            if (__line.Trim().Length == 0) continue;
            if (__line.Trim().StartsWith(";")) continue;
            if (__line.Trim().StartsWith("--")) continue;
            // ===================================================
            // Inicio del modo multi línea
            // ===================================================
            if (__line.Trim().StartsWith(">>>"))
            {
              __multiLine.active = true;
              __multiLine.Name = "";
              __multiLine.Buffer.Clear();
              continue;
            }
            if (__multiLine.active)
            {
              // =================================================
              // Nombre de la consulta
              // =================================================
              if (__multiLine.Name == "")
              {
                __multiLine.Name = __line;
                continue;
              }
              // ============================================================
              // Fin del modo multi línea
              // ============================================================
              if (__line == "<<<")
              {
                _querys.Add(__multiLine.Name, __multiLine.Buffer.ToString());
                Trace.WriteLine("  " + __multiLine.Name);
                __multiLine.active = false;
                continue;
              }
              if (__line.StartsWith("#"))
              {
                _querys.Add(__multiLine.Name, __multiLine.Buffer.ToString());
                Trace.WriteLine("  " + __multiLine.Name);
                __multiLine.active = false;
              }
              else
              {
                // =============================================
                // Almacenar la línea
                // =============================================
                __multiLine.Buffer.AppendLine(__line);
                continue;
              }
            }
            // =========================================================================
            // Consultas en una sola línea
            // =========================================================================
            int index = __line.IndexOf('%');
            _querys.Add(__line.Substring(1, index - 1), __line.Substring(index + 1));
            Trace.WriteLine("  " + __line.Substring(1, index - 1));
          }
          if (__multiLine.active)
          {
            _querys.Add(__multiLine.Name, __multiLine.Buffer.ToString());
            Trace.WriteLine("  " + __multiLine.Name);
          }
        }
      }

      /// <summary>
      /// Obtiene la sentencia SQL con un nombre o clave determinada.
      /// </summary>
      /// <param name="name">Nombre o clave de la sentencia SQL que se quier recuperar.</param>
      /// <returns></returns>
      public string this[string key]
      {
        get
        {
          return _querys[key];
        }
      }

      /// <summary>
      /// Obtiene un array de cadenas con las claves o nombres de las sentencias SQL en el repositorio.
      /// </summary>
      public string[] Keys
      {
        get
        {
          return Enumerable.ToArray<string>(_querys.Keys);
        }
      }


      /// <summary>
      /// Clase utilizada para almacenar temporalmente y durante el procesado de las sentencias SQLs el
      /// contenido de aquellas especificadas en más de una línea.
      /// <code>
      /// &lt;&lt;&lt;
      /// Dal.Repositories.table_name.SelectAllSmall
      /// SELECT ID
      /// FROM [TableName]
      /// &gt;&gt;&gt; o #Dal.Repositories.other_table_name.SelectAllSmall
      /// </code>
      /// </summary>
      private class Multiline
      {
        public string Name = "";
        public StringBuilder Buffer = new StringBuilder();
        public bool active = false;
      }
    }

  }

  /// <summary>
  /// Atributo para establecer el nombre o prefijo del repositorio de las clases que heredan de <see cref="RepositoryBase"/>
  /// para obtener las sentencias SQL desde los ficheros *.Queries.txt.
  /// <code>
  /// [RepoName("Dal.Repositories.UsuariosRepository")]
  /// public class UsuariosRepository : RepositoryBase { 
  /// ...
  /// }
  /// </code>
  /// </summary>
  [System.AttributeUsage(System.AttributeTargets.Class)]
  public class RepoName : System.Attribute
  {
    public RepoName(string name)
    {
      Name = name;
    }
    public string Name { get; }
  }

}
