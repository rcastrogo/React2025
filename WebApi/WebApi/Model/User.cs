
using System.Text.Json.Serialization;

namespace WebApi.Model
{
  public class User
  {

    public User() {
      Name = "";
    } 
    public int Id { get; set; }

    [JsonPropertyName("Nombre")]
    public string Name { get; set; }

  }

  public record Address(string Calle, string Numero);

}
