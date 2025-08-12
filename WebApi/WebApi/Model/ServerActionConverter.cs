using System.Text.Json;
using System.Text.Json.Serialization;

namespace WebApi.Model;


/// <summary>
/// Define los posibles estados del resultado de una operación.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ApiResult
{
    Ok,
    Error
}

/// <summary>
/// Representa una acción genérica que el cliente debe ejecutar.
/// El payload se define como un objeto para permitir cualquier tipo de dato.
/// </summary>
public record ServerAction(
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("payload")] object Payload
);

/// <summary>
/// Clase genérica para envolver la respuesta completa de la API.
/// </summary>
/// <typeparam name="TResponse">Tipo del objeto de respuesta principal.</typeparam>
public record ApiResponse<TResponse>(
    [property: JsonPropertyName("result")] ApiResult Result,
    [property: JsonPropertyName("response")] TResponse? Response,
    [property: JsonPropertyName("actions")] List<ServerAction> Actions
);
