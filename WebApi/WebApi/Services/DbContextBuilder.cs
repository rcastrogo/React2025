using Dal.Core.Connections;
using Negocio.Core;

namespace WebApi.Services;

public class DbContextBuilder : IDbContextBuilder
{

  public Dal.Core.DbContext Build(string key) => ConnectionManager.CreateDbContext(key);

}


