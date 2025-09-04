

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class EstadoPedido : Entity
  {

    public EstadoPedido(){ }
    public EstadoPedido(DbContext context) : base(context) { }
     
  
    public EstadoPedido Load(){
      return Load(Id);
    }
  
    public EstadoPedido Load(long id){    
      using (EstadosPedidosRepository repo = new EstadosPedidosRepository(DataContext)){
        return repo.LoadOne<EstadoPedido>(this, repo.GetItem(id));
      }   
    }

    public EstadoPedido Save(){
      using (EstadosPedidosRepository repo = new EstadosPedidosRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Codigo, Descripcion);
        } else{
          repo.Update(Id, Codigo, Descripcion);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (EstadosPedidosRepository repo = new EstadosPedidosRepository(DataContext)){
        repo.Delete(_id);
      }
    }
  

    long _id;
    public override long Id  
    {
      get { return _id; }         
      set { _id = value; }
    }

    string _codigo = "";
    public string Codigo  
    {
      get { return _codigo; }         
      set { _codigo = value; }
    }

    string _descripcion = "";
    public string Descripcion  
    {
      get { return _descripcion; }         
      set { _descripcion = value; }
    }

  }
}
