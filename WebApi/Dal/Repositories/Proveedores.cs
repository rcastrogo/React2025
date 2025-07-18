
using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;
using System.Data;

namespace Dal.Repositories
{

  [RepoName("Dal.Repositories.ProveedoresRepository")]
  public class ProveedoresRepository : RepositoryBase
  {

    public ProveedoresRepository(DbContext context) : base(context) { }

    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)
                             .And("Nif", "Nif")
                             .AndListOf<string>("Nombre")
                             .AndListOf<long>("Ids", "id");
      return GetItems(__builder);
    }

    public long Insert(string nif,
                       string nombre,
                       string descripcion)
    {
      return Insert(new ParameterBag().Use("Nif", nif)
                                       .Use("Nombre", nombre)
                                       .Use("Descripcion", descripcion));
    }

    public int Update(long id,
                      string nif,
                      string nombre,
                      string descripcion)
    {
      return Update(new ParameterBag(id).Use("Nif", nif)
                                         .Use("Nombre", nombre)
                                         .Use("Descripcion", descripcion));
    }

  }
}

