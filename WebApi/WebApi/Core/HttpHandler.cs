
using WebApi.Core.Logging;
using WebApi.Services;

namespace WebApi.Core.Handlers
{
  public abstract class HttpHandler
  {
    private ContextWrapper _contextWrapper;
    protected Microsoft.Extensions.Logging.ILogger?_logger;

    public HttpHandler(HttpContext httpContext)
    {
      _contextWrapper = new ContextWrapper(httpContext);
    }

    public HttpContext HttpContext => _contextWrapper.HttpContext;
    public String GetItem(String key) => _contextWrapper.GetItem(key);
    public String GetItem(String key, String @default) => _contextWrapper.GetItem(key, @default);
    public int ParseInteger(String key, int @default) => _contextWrapper.ParseInteger(key, @default);
    public int ParseInteger(string key, string message) => _contextWrapper.ParseInteger(key, message);
    public Boolean IsEmpty(String key) => GetItem(key) == String.Empty;

    public abstract Task ProcessRequest();

    protected HttpHandler Log(string message)
    {
      if (_logger is not null)
        _logger.LogInformation(message);
      else
        AppLogging.Log(message);
      return this;
    }

    private string? _body;
    protected async Task<string> GetBodyAsync()
    {
      if (_body == null)
      {
        var request = _contextWrapper.HttpContext.Request;
        request.EnableBuffering();
        using var reader = new StreamReader(
            request.Body,
            encoding: System.Text.Encoding.UTF8,
            detectEncodingFromByteOrderMarks: false,
            bufferSize: 1024,
            leaveOpen: true);

        _body = await reader.ReadToEndAsync();
        request.Body.Position = 0;
      }
      return _body;
    }

  }

}
