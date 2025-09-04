

using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;
using System.Collections.Generic;
using System.Data;

namespace Dal.Repositories{


  [RepoName("Dal.Repositories.RolesDistribuidorRepository")]
  public class RolesDistribuidorRepository : RepositoryBase {
  
    public RolesDistribuidorRepository(DbContext context) : base(context) { }
        
    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)                            
                            .And("RolesUsuarioId") 
                            .AndDate("FechaDeCreacion") 
                            .AndListOf<long>("Ids", "id"); 
      return GetItems(__builder);
    }                
    
    public long Insert(int rolesUsuarioId, 
                      string fechaDeCreacion){ 
      return Insert(new ParameterBag()
                          .Use("RolesUsuarioId", rolesUsuarioId)
                          .Use("FechaDeCreacion", fechaDeCreacion));                
    }
    
    public int Update(long distribuidorId, 
                      int rolesUsuarioId, 
                      string fechaDeCreacion){
      return Update( new ParameterBag()
                          .Use("DistribuidorId", distribuidorId)
                          .Use("RolesUsuarioId", rolesUsuarioId)
                          .Use("FechaDeCreacion", fechaDeCreacion));           
    }

  }
}
    
