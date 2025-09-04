

using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;
using System.Collections.Generic;
using System.Data;

namespace Dal.Repositories{


  [RepoName("Dal.Repositories.TiposDeDocumentoRepository")]
  public class TiposDeDocumentoRepository : RepositoryBase {
  
    public TiposDeDocumentoRepository(DbContext context) : base(context) { }
        
    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)                            
                            .And("Codigo","Codigo") 
                            .And("Descripcion","Descripcion") 
                            // Activo .And boolean 
                            .AndListOf<long>("Ids", "id"); 
      return GetItems(__builder);
    }                
    
    public long Insert(string codigo, 
                      string descripcion, 
                      bool activo){ 
      return Insert(new ParameterBag()
                          .Use("Codigo", codigo)
                          .Use("Descripcion", descripcion)
                          .Use("Activo", activo));                
    }
    
    public int Update(long id, 
                      string codigo, 
                      string descripcion, 
                      bool activo){
      return Update( new ParameterBag()
                          .Use("Id", id)
                          .Use("Codigo", codigo)
                          .Use("Descripcion", descripcion)
                          .Use("Activo", activo));           
    }

  }
}
    
