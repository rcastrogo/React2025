

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class RolUsuario : Entity
  {

    public RolUsuario(){ }
    public RolUsuario(DbContext context) : base(context) { }
     
  
    public RolUsuario Load(){
      return Load(Id);
    }
  
    public RolUsuario Load(long id){    
      using (RolesUsuarioRepository repo = new RolesUsuarioRepository(DataContext)){
        return repo.LoadOne<RolUsuario>(this, repo.GetItem(id));
      }   
    }

    public RolUsuario Save(){
      using (RolesUsuarioRepository repo = new RolesUsuarioRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Codigo, Descripcion, NivelPermiso);
        } else{
          repo.Update(Id, Codigo, Descripcion, NivelPermiso);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (RolesUsuarioRepository repo = new RolesUsuarioRepository(DataContext)){
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

    int _nivelPermiso;
    public int NivelPermiso  
    {
      get { return _nivelPermiso; }         
      set { _nivelPermiso = value; }
    }

  }
}
