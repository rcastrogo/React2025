

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class Departamento : Entity
  {

    public Departamento(){ }
    public Departamento(DbContext context) : base(context) { }
     
  
    public Departamento Load(){
      return Load(Id);
    }
  
    public Departamento Load(long id){    
      using (DepartamentosRepository repo = new DepartamentosRepository(DataContext)){
        return repo.LoadOne<Departamento>(this, repo.GetItem(id));
      }   
    }

    public Departamento Save(){
      using (DepartamentosRepository repo = new DepartamentosRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Codigo, Descripcion);
        } else{
          repo.Update(Id, Codigo, Descripcion);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (DepartamentosRepository repo = new DepartamentosRepository(DataContext)){
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
