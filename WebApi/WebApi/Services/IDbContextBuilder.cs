namespace WebApi.Services
{

  public interface IDbContextBuilder
  {
    Dal.Core.DbContext Build(string key="Default");
  }

}
