using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Xml.Serialization;
using Microsoft.VisualBasic.CompilerServices;
using Negocio.Core;

namespace Negocio
{

  public static class Extensions
  {

    public static T FromJsonTo<T>(this string jsonString) where T : class
    {
      return JsonSerializer.Deserialize<T>(jsonString, new JsonSerializerOptions() { IncludeFields = true });
    }

    public static T FromXmlTo<T>(this string xml) where T : class
    {
      using (StringReader reader = new StringReader(xml))
      {
        XmlSerializer serializer = new XmlSerializer(typeof(T));
        return Conversions.ToGenericParameter<T>(serializer.Deserialize(reader));
      }
    }

    public static string ToJsonString<T>(this T value) where T : class
    {
      return new SmallXmlSerializer(typeof(T)).ToJsonString(value);
    }

    public static string ToJsonString<T>(this EntityList<T> values, FieldInfo[] mapInfo) where T : Entity
    {
      return new SmallXmlSerializer(typeof(T), mapInfo, values).ToJsonString();
    }

    public static string ToXml<T>(this T value) where T : class
    {
      using EncodedStringWriter stringWriter = new EncodedStringWriter();
      using CustomXmlTextWriter textWriter = new CustomXmlTextWriter(stringWriter);
      // ============================================================================
      // Para serializar "correctamente" colecciones de tipos creados dinámicamente
      // ============================================================================
      if (value is IList<object> __list)
      {
        textWriter.WriteStartDocument();
        textWriter.WriteStartElement("items");
        if (__list.Count > 0)
        {
          var __s1 = new XmlSerializer(__list[0].GetType());
          __list.ToList()
                .ForEach(o => __s1.Serialize(textWriter, o));
        }
        textWriter.WriteEndElement();
        return stringWriter.ToString();
      }
      // ============================================================================
      // Serializar normalmente el resto de tipos
      // ============================================================================
      var __s2 = new XmlSerializer(value.GetType());
      __s2.Serialize(textWriter, value);
      return stringWriter.ToString();
    }

    private class EncodedStringWriter : StringWriter
    {

      private System.Text.Encoding _encoding;

      public EncodedStringWriter(System.Text.Encoding encoding = null) => _encoding = encoding ?? System.Text.Encoding.UTF8;
      public override System.Text.Encoding Encoding => _encoding;

    }

    private class CustomXmlTextWriter : System.Xml.XmlTextWriter
    {
      public CustomXmlTextWriter(TextWriter w) : base(w) {}
      public CustomXmlTextWriter(Stream w, Encoding encoding) : base(w, encoding) { }
      public CustomXmlTextWriter(string filename, Encoding encoding) : base(filename, encoding) { }

      bool _skip = false;
      public bool StartDocumentEnabled = true;

      public override void WriteStartDocument()
      {
        if(StartDocumentEnabled) base.WriteStartDocument();
      }

      public override void WriteStartAttribute(string prefix, string localName, string ns)
      {
        if (localName == "type" || 
            prefix == "xmlns" && (localName == "xsd" || localName == "xsi"))
        {
          _skip = true;
          return;
        }
        base.WriteStartAttribute(prefix, localName, ns);
      }

      public override void WriteStartElement(string prefix, string localName, string ns)
      {
        string __name = localName;
        if(localName== "anyType") __name = "item";
        if(localName== "ArrayOfAnyType") __name = "items";
        base.WriteStartElement(prefix, __name, ns);
      }

      public override void WriteString(string text)
      {
        if (_skip) return;
        base.WriteString(text);
      }

      public override void WriteEndAttribute()
      {
        if (_skip)
        {
          _skip = false;
          return;
        }
        base.WriteEndAttribute();
      }

    }

  }

}
