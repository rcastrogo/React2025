
using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;
using System.Collections.Generic;
using System.Data;

namespace Dal.Repositories
{

  [RepoName("Dal.Repositories.VehiculosRepository")]
  public class VehiculosRepository : RepositoryBase
  {

    public VehiculosRepository(DbContext context) : base(context) { }

    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)
                             .And("Matricula")
                             .And("Marca")
                             .And("Modelo")
                             .AndListOf<long>("Ids", "id");
      return GetItems(__builder);
    }

    public long Insert(string matricula,
                       string marca,
                       string modelo)
    {
      return Insert(new ParameterBag().Use("Matricula", matricula)
                                      .Use("Marca", marca, true)
                                      .Use("Modelo", modelo, true));
    }

    public int Update(long id,
                      string matricula,
                      string marca,
                      string modelo,
                      string fechaDeModificacion,
                      int numero,
                      string observaciones)
    {
      return Update(new ParameterBag(id).Use("Matricula", matricula)
                                        .Use("Marca", marca)
                                        .Use("Modelo", modelo)
                                        .Use("FechaDeModificacion", fechaDeModificacion, true)
                                        .Use("Numero", numero, true)
                                        .Use("Observaciones", observaciones, true));
    }

  }
}

