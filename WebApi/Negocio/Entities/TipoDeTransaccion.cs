

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class TipoDeTransaccion : Entity
  {

    public TipoDeTransaccion(){ }
    public TipoDeTransaccion(DbContext context) : base(context) { }
     
  
    public TipoDeTransaccion Load(){
      return Load(Id);
    }
  
    public TipoDeTransaccion Load(long id){    
      using (TiposDeTransaccionRepository repo = new TiposDeTransaccionRepository(DataContext)){
        return repo.LoadOne<TipoDeTransaccion>(this, repo.GetItem(id));
      }   
    }

    public TipoDeTransaccion Save(){
      using (TiposDeTransaccionRepository repo = new TiposDeTransaccionRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Codigo, Descripcion, Naturaleza);
        } else{
          repo.Update(Id, Codigo, Descripcion, Naturaleza);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (TiposDeTransaccionRepository repo = new TiposDeTransaccionRepository(DataContext)){
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

    string _naturaleza = "";
    public string Naturaleza  
    {
      get { return _naturaleza; }         
      set { _naturaleza = value; }
    }

  }
}
