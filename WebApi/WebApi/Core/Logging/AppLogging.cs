using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace WebApi.Core.Logging
{

  public static class AppLogging
  {

    private static Microsoft.Extensions.Logging.ILoggerFactory _loggerFactory = null;
    private static Microsoft.Extensions.Logging.ILogger _logger = null;

    public static void UsePolLogging(this WebApplication app)
    {
      _loggerFactory = app.Services.GetService<ILoggerFactory>();
      _logger = _loggerFactory.CreateLogger("WebApi");
      Trace.Listeners.Add(new __traceListener());
    }

    private class __traceListener : System.Diagnostics.TraceListener
    {

      private Microsoft.Extensions.Logging.ILogger _logger = _loggerFactory.CreateLogger("WebApi.Negocio");

      public override void Write(string message)
      {
        _logger.LogInformation(message);
      }
      public override void WriteLine(string message)
      {
        _logger.LogInformation(message);
      }

    }

    public static Microsoft.Extensions.Logging.ILogger CreateLogger(string name)
    {
      return _loggerFactory.CreateLogger(name);
    }

    public static void Log(string message)
    {
      if (_logger is not null) _logger.LogInformation(message);
    }

  }

}
