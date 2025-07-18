using System;
using System.Web;
using Microsoft.Extensions.Primitives;

namespace WebApi.Core
{

  public class ContextWrapper
  {

    private HttpContext _httpContext;
    private Dictionary<string, StringValues> _params;

    #region Constructor

    public ContextWrapper(HttpContext httpContext)
    {
      _httpContext = httpContext;
      _params = _httpContext.Request.Query
                            .Concat(_httpContext.Request.Headers)
                            .Concat(_httpContext.Request
                                                .HasFormContentType ? _httpContext.Request.Form 
                                                                    : new List<KeyValuePair<String, StringValues>>())
                            .ToDictionary(p => p.Key,
                                          p => p.Value);
    }

    #endregion

    #region Properties

    public HttpContext HttpContext
    {
      get { return _httpContext; }
    }

    #endregion

    #region MÉTODOS

    public String GetItem(String key)
    {
      return GetItem(key, "");
    }

    public String GetItem(String key, String @default)
    {
      String __result = __getItem(key);
      if (__result == String.Empty) return @default;
      return __result;
    }

    public int ParseInteger(String key, int @default)
    {
      int __result = 0;
      if (int.TryParse(GetItem(key), out __result))
        return __result;
      else
        return @default;
    }

    public int ParseInteger(string key, string message)
    {
      int __result = ParseInteger(key, 0);
      if (__result < 1)
        throw new Exception(message);
      return __result;
    }

    public Boolean IsEmpty(String key)
    {
      return GetItem(key) == String.Empty;
    }

    #endregion

    #region Private methods

    private String __getItem(String key)
    {
      if (_httpContext == null) return "";
      if (_httpContext.Request == null) return "";
      if (_params.ContainsKey(key)) return _params[key].ToString().Trim();
      return "";
    }

    #endregion

  }

}
