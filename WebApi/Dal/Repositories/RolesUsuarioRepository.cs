

using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;
using System.Collections.Generic;
using System.Data;

namespace Dal.Repositories{


  [RepoName("Dal.Repositories.RolesUsuarioRepository")]
  public class RolesUsuarioRepository : RepositoryBase {
  
    public RolesUsuarioRepository(DbContext context) : base(context) { }
        
    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)                            
                            .And("Codigo","Codigo") 
                            .And("Descripcion","Descripcion") 
                            .And("NivelPermiso") 
                            .AndListOf<long>("Ids", "id"); 
      return GetItems(__builder);
    }                
    
    public long Insert(string codigo, 
                      string descripcion, 
                      int nivelPermiso){ 
      return Insert(new ParameterBag()
                          .Use("Codigo", codigo)
                          .Use("Descripcion", descripcion)
                          .Use("NivelPermiso", nivelPermiso));                
    }
    
    public int Update(long id, 
                      string codigo, 
                      string descripcion, 
                      int nivelPermiso){
      return Update( new ParameterBag()
                          .Use("Id", id)
                          .Use("Codigo", codigo)
                          .Use("Descripcion", descripcion)
                          .Use("NivelPermiso", nivelPermiso));           
    }

  }
}
    
