

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class Moneda : Entity
  {

    public Moneda(){ }
    public Moneda(DbContext context) : base(context) { }
     
  
    public Moneda Load(){
      return Load(Id);
    }
  
    public Moneda Load(long id){    
      using (MonedasRepository repo = new MonedasRepository(DataContext)){
        return repo.LoadOne<Moneda>(this, repo.GetItem(id));
      }   
    }

    public Moneda Save(){
      using (MonedasRepository repo = new MonedasRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Codigo, Descripcion, Simbolo);
        } else{
          repo.Update(Id, Codigo, Descripcion, Simbolo);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (MonedasRepository repo = new MonedasRepository(DataContext)){
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

    string _simbolo = "";
    public string Simbolo  
    {
      get { return _simbolo; }         
      set { _simbolo = value; }
    }

  }
}
