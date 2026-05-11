using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace WebApi.Core.Logging
{

  public static class AppLogging
  {

    private static Microsoft.Extensions.Logging.ILoggerFactory? _loggerFactory;
    private static Microsoft.Extensions.Logging.ILogger? _logger;

    public static void UsePolLogging(this WebApplication app)
    {
      _loggerFactory = app.Services.GetService<ILoggerFactory>();
      _logger = _loggerFactory?.CreateLogger("WebApi");
      Trace.Listeners.Add(new __traceListener());
    }

    private class __traceListener : System.Diagnostics.TraceListener
    {
        private readonly Microsoft.Extensions.Logging.ILogger? _logger = _loggerFactory?.CreateLogger("WebApi.Negocio");

        public override void Write(string? message)
        {
            if (!string.IsNullOrEmpty(message)) _logger?.LogInformation("{Message}", message);
        }
    
        public override void WriteLine(string? message)
        {
            if (!string.IsNullOrEmpty(message)) _logger?.LogInformation("{Message}", message);
        }
    }

    public static Microsoft.Extensions.Logging.ILogger CreateLogger(string name)
    {
        return _loggerFactory?.CreateLogger(name) 
               ?? throw new InvalidOperationException("AppLogging no ha sido inicializado. Llama primero a UsePolLogging.");
    }

    public static void Log(string message)
    {
      if (_logger is not null) _logger.LogInformation(message);
    }

  }

}
