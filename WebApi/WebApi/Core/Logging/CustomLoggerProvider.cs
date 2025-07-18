
using Microsoft.Extensions.Options;
using WebApi.Core.Settings;

namespace WebApi.Core.Logging
{

  public class CustomLoggerProvider : ILoggerProvider
  {
    private AppSettings _settings = new AppSettings();

    public CustomLoggerProvider(IOptions<AppSettings> settings, AppSettings appSettings)
    {
      _settings = settings.Value;
    }

    public ILogger CreateLogger(string name)
    {
      return new CustomLogger(name, _settings);
    }

    public void Dispose() { }

  }

}
