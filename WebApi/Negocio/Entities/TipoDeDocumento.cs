

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class TipoDeDocumento : Entity
  {

    public TipoDeDocumento(){ }
    public TipoDeDocumento(DbContext context) : base(context) { }
     
  
    public TipoDeDocumento Load(){
      return Load(Id);
    }
  
    public TipoDeDocumento Load(long id){    
      using (TiposDeDocumentoRepository repo = new TiposDeDocumentoRepository(DataContext)){
        return repo.LoadOne<TipoDeDocumento>(this, repo.GetItem(id));
      }   
    }

    public TipoDeDocumento Save(){
      using (TiposDeDocumentoRepository repo = new TiposDeDocumentoRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Codigo, Descripcion, Activo);
        } else{
          repo.Update(Id, Codigo, Descripcion, Activo);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (TiposDeDocumentoRepository repo = new TiposDeDocumentoRepository(DataContext)){
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

    bool _activo;
    public bool Activo  
    {
      get { return _activo; }         
      set { _activo = value; }
    }

  }
}
