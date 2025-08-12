
using WebApi.Core.Settings;

namespace WebApi.Core.Logging
{

  public class CustomLogger : ILogger
  {

    private readonly string _name;
    private readonly AppSettings _settings;

    public CustomLogger(string name, AppSettings settings)
    {
      _name = string.IsNullOrEmpty(name) ? nameof(CustomLogger) : name;
      _settings = settings;
    }

    public IDisposable BeginScope<TState>(TState state)
    {
      return NoopDisposable.Instance;
    }

    public bool IsEnabled(LogLevel logLevel)
    {
      return true;
    }

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
    {

      if (formatter == null) throw new ArgumentNullException(nameof(formatter));
      var message = formatter(state, exception);

      if (string.IsNullOrEmpty(message)) return;

      message = $"[{DateTime.Now.TimeOfDay.ToString()}] [{_name}] {message}\n";

      if (exception != null) message += Environment.NewLine +
                                        Environment.NewLine +
                                        exception.ToString();

      if (_settings.LogToConsole == true) Console.Write(message);
      if (_settings.LogToFile == true)
      {
        try
        {
          File.AppendAllText(Path.Combine(Environment.CurrentDirectory, $"Logs\\{DateTime.Now.ToString("yyyyMMdd")}.log.txt"), message);
        }
        catch (Exception)
        {

        }
      }
    }

    private class NoopDisposable : IDisposable
    {
      public static NoopDisposable Instance = new NoopDisposable();

      public void Dispose() { }
    }
  }

}
