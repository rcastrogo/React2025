

using Dal.Core;
using Dal.Core.Loader;
using Dal.Core.Queries;
using System.Collections.Generic;
using System.Data;

namespace Dal.Repositories{


  [RepoName("Dal.Repositories.DistribuidoresRepository")]
  public class DistribuidoresRepository : RepositoryBase {
  
    public DistribuidoresRepository(DbContext context) : base(context) { }
        
    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)                            
                            .And("Nif","Nif") 
                            .And("Nombre","Nombre") 
                            .And("Email","Email") 
                            .And("Direccion","Direccion") 
                            .And("Ciudad","Ciudad") 
                            .And("PaisId") 
                            .And("Telefono","Telefono") 
                            .And("CategoriaProductoId") 
                            .And("TipoDocumentoId") 
                            .And("TipoTransaccionId") 
                            .And("MonedaId") 
                            .And("Activo") 
                            .AndDate("FechaAlta") 
                            .AndListOf<long>("Ids", "id"); 
      return GetItems(__builder);
    }                
    
    public long Insert(string nif, 
                      string nombre, 
                      string email, 
                      string direccion, 
                      string ciudad, 
                      int paisId, 
                      string telefono, 
                      int categoriaProductoId, 
                      int tipoDocumentoId, 
                      int tipoTransaccionId, 
                      int monedaId, 
                      int activo){ 
      return Insert(new ParameterBag()
                          .Use("Nif", nif)
                          .Use("Nombre", nombre)
                          .Use("Email", email)
                          .Use("Direccion", direccion)
                          .Use("Ciudad", ciudad)
                          .Use("PaisId", paisId)
                          .Use("Telefono", telefono)
                          .Use("CategoriaProductoId", categoriaProductoId)
                          .Use("TipoDocumentoId", tipoDocumentoId)
                          .Use("TipoTransaccionId", tipoTransaccionId)
                          .Use("MonedaId", monedaId)
                          .Use("Activo", activo));                
    }
    
    public int Update(long id, 
                      string nif, 
                      string nombre, 
                      string email, 
                      string direccion, 
                      string ciudad, 
                      int paisId, 
                      string telefono, 
                      int categoriaProductoId, 
                      int tipoDocumentoId, 
                      int tipoTransaccionId, 
                      int monedaId, 
                      int activo){
      return Update( new ParameterBag()
                          .Use("Id", id)
                          .Use("Nif", nif)
                          .Use("Nombre", nombre)
                          .Use("Email", email)
                          .Use("Direccion", direccion)
                          .Use("Ciudad", ciudad)
                          .Use("PaisId", paisId)
                          .Use("Telefono", telefono)
                          .Use("CategoriaProductoId", categoriaProductoId)
                          .Use("TipoDocumentoId", tipoDocumentoId)
                          .Use("TipoTransaccionId", tipoTransaccionId)
                          .Use("MonedaId", monedaId)
                          .Use("Activo", activo));           
    }

  }
}
    
