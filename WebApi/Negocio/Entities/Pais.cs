

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class Pais : Entity
  {

    public Pais(){ }
    public Pais(DbContext context) : base(context) { }
     
  
    public Pais Load(){
      return Load(Id);
    }
  
    public Pais Load(long id){    
      using (PaisesRepository repo = new PaisesRepository(DataContext)){
        return repo.LoadOne<Pais>(this, repo.GetItem(id));
      }   
    }

    public Pais Save(){
      using (PaisesRepository repo = new PaisesRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Codigo, Descripcion, PrefijoTelefonico);
        } else{
          repo.Update(Id, Codigo, Descripcion, PrefijoTelefonico);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (PaisesRepository repo = new PaisesRepository(DataContext)){
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

    string _prefijoTelefonico = "";
    public string PrefijoTelefonico  
    {
      get { return _prefijoTelefonico; }         
      set { _prefijoTelefonico = value; }
    }

  }
}
