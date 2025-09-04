using Microsoft.AspNetCore.Mvc;
using WebApi.Model;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
public class BaseApiController : ControllerBase
{

  protected List<ServerAction> Actions = new List<ServerAction>();
  private readonly IDbContextBuilder _dbContextBuilder;

  public BaseApiController(IDbContextBuilder dbContextBuilder)
  {
    _dbContextBuilder = dbContextBuilder;
  }

  /// <summary>
  /// Crea y devuelve una respuesta de éxito con un objeto de datos y acciones opcionales.
  /// </summary>
  /// <typeparam name="TResponse">Tipo del objeto de respuesta.</typeparam>
  /// <param name="response">El objeto de datos a devolver.</param>
  /// <param name="actions">Lista de acciones opcionales para el cliente.</param>
  protected ActionResult<ApiResponse<TResponse>> OkResponse<TResponse>(
      TResponse response,
      List<ServerAction>? actions = null)
  {
    var apiResponse = new ApiResponse<TResponse>(
        Result: ApiResult.Ok,
        Response: response,
        Actions: actions ?? new List<ServerAction>()
    );
    return Ok(apiResponse);
  }

  /// <summary>
  /// Crea y devuelve una respuesta de error con un objeto de datos y acciones opcionales.
  /// </summary>
  /// <typeparam name="TResponse">Tipo del objeto de respuesta.</typeparam>
  /// <param name="response">El objeto de datos a devolver.</param>
  /// <param name="actions">Lista de acciones opcionales para el cliente.</param>
  protected ActionResult<ApiResponse<TResponse>> ErrorResponse<TResponse>(
      TResponse? response,
      List<ServerAction>? actions = null)
  {
    var apiResponse = new ApiResponse<TResponse>(
        Result: ApiResult.Error,
        Response: response,
        Actions: actions ?? new List<ServerAction>()
    );
    return Ok(apiResponse);
  }

  // --- Métodos de Ayuda para Acciones ---

  /// <summary>
  /// Crea una acción de tipo 'error' para mostrar una notificación.
  /// </summary>
  protected ServerAction ErrorAction(string message)
  {
    return new ServerAction("error", message);
  }

  /// <summary>
  /// Crea una acción de tipo 'alert' para mostrar una alerta genérica.
  /// </summary>
  protected ServerAction AlertAction(string message)
  {
    return new ServerAction("alert", message);
  }

  /// <summary>
  /// Crea una acción de tipo 'navigate' para redirigir al cliente.
  /// </summary>
  protected ServerAction NavigateAction(string url)
  {
    return new ServerAction("navigate", url);
  }

  /// <summary>
  /// Crea una acción de tipo 'focus' para enfocar un elemento de la UI.
  /// </summary>
  protected ServerAction FocusAction(string selector)
  {
    return new ServerAction("focus", selector);
  }

  /// <summary>
  /// Crea una acción de tipo 'publish' para un evento de PubSub.
  /// </summary>
  /// <param name="topic">El nombre del tema a publicar.</param>
  /// <param name="data">Los datos a enviar en el evento.</param>
  protected ServerAction PublishAction(string topic, object? data = null)
  {
    return new ServerAction("publish", new { topic, data });
  }

  protected ServerAction ExceptionMessageAction(Exception ex, string title)
  {
    return new ServerAction("publish", new
    {
      topic = "SHOW_MODAL",
      data = new
      {
        title = title,
        content = formatExceptionInfo(ex),
        showCloseButton = true,
        allowManualClose = false,
        asInnerHTML = true
      }
    });
  }


  private string formatExceptionInfo(Exception ex)
  {
    return $@"
        <div class=""w3-padding"">
            <b>{ex.Message}</b>
            <div class=""w3-border-top"">
              {ex.ToString()}
            </div>
        </div>";
  }

}