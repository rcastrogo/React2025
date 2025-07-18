
using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;
using System.Collections.Generic;
using System.Data;

namespace Dal.Repositories.Sqlite
{

  [RepoName("Dal.Repositories.Sqlite.UsuariosRepository@Sqlite01")]
  public class UsuariosRepository : RepositoryBase
  {

    public UsuariosRepository(DbContext context) : base(context) { }

    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)
                             .And("Nif", "Nif")
                             .AndListOf<string>("Nombre")
                             .AndLike("Descripcion")
                             .AndListOf<long>("Ids", "id")
                             .AndSentence("Id IN (SELECT Id FROM [Vehiculo])");
      return GetItems(__builder);
    }


    public long Insert(string nombre, long valor)
    {
      return Insert(new ParameterBag().Use("name", nombre)
                                       .Use("value", valor));
    }

    public long Update(long id, string nombre, long valor)
    {
      return Update(new ParameterBag(id).Use("name", nombre)
                                         .Use("value", valor));
    }

  }
}

