

using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;
using System.Collections.Generic;
using System.Data;

namespace Dal.Repositories{


  [RepoName("Dal.Repositories.MonedasRepository")]
  public class MonedasRepository : RepositoryBase {
  
    public MonedasRepository(DbContext context) : base(context) { }
        
    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)                            
                            .And("Codigo","Codigo") 
                            .And("Descripcion","Descripcion") 
                            .And("Simbolo","Simbolo") 
                            .AndListOf<long>("Ids", "id"); 
      return GetItems(__builder);
    }                
    
    public long Insert(string codigo, 
                      string descripcion, 
                      string simbolo){ 
      return Insert(new ParameterBag()
                          .Use("Codigo", codigo)
                          .Use("Descripcion", descripcion)
                          .Use("Simbolo", simbolo));                
    }
    
    public int Update(long id, 
                      string codigo, 
                      string descripcion, 
                      string simbolo){
      return Update( new ParameterBag()
                          .Use("Id", id)
                          .Use("Codigo", codigo)
                          .Use("Descripcion", descripcion)
                          .Use("Simbolo", simbolo));           
    }

  }
}
    
