
using System.Data;
using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;

namespace Dal.Repositories
{

  [RepoName("Dal.Repositories.UsuariosRepository")]
  public class UsuariosRepository : RepositoryBase {
  
    public UsuariosRepository(DbContext context) : base(context) { }
    
    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)
                             .And("Nif", "Nif")
                             .And("Id")
                             .AndListOf<string>("Nombre")
                             .AndLike("Descripcion")
                             .AndListOf<long>("Ids", "id")
                             .AndSentence("Id IN (SELECT Id FROM [Vehiculo])")
                             .AndDate("FechaDeAlta")
                             .AndDateTime("FechaHoraDeAlta", "FechaDeAlta");
      return GetItems(__builder);
    }

    public long Insert(string nif, 
                       string nombre, 
                       string descripcion){
      return Insert( new ParameterBag().Use("Nif", nif)
                                       .Use("Nombre", nombre)
                                       .Use("Descripcion", descripcion));                 
    }
    
    public int Update(long id, 
                      string nif, 
                      string nombre, 
                      string descripcion){			         
      return Update( new ParameterBag(id).Use("Nif", nif)
                                         .Use("Nombre", nombre)
                                         .Use("Descripcion", descripcion));           
    }

  }
}
    
