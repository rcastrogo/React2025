

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class Categoria : Entity
  {

    public Categoria(){ }
    public Categoria(DbContext context) : base(context) { }
     
  
    public Categoria Load(){
      return Load(Id);
    }
  
    public Categoria Load(long id){    
      using (CategoriasRepository repo = new CategoriasRepository(DataContext)){
        return repo.LoadOne<Categoria>(this, repo.GetItem(id));
      }   
    }

    public Categoria Save(){
      using (CategoriasRepository repo = new CategoriasRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Codigo, Descripcion, Orden);
        } else{
          repo.Update(Id, Codigo, Descripcion, Orden);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (CategoriasRepository repo = new CategoriasRepository(DataContext)){
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

    int _orden;
    public int Orden  
    {
      get { return _orden; }         
      set { _orden = value; }
    }

  }
}
