

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class RolDistribuidor : Entity
  {

    public RolDistribuidor(){ }
    public RolDistribuidor(DbContext context) : base(context) { }
     
  
    public RolDistribuidor Load(){
      return Load(Id);
    }
  
    public RolDistribuidor Load(long id){    
      using (RolesDistribuidorRepository repo = new RolesDistribuidorRepository(DataContext)){
        return repo.LoadOne<RolDistribuidor>(this, repo.GetItem(id));
      }   
    }

    public RolDistribuidor Save(){
      using (RolesDistribuidorRepository repo = new RolesDistribuidorRepository(DataContext)){
        if(_distribuidorId == 0){
          _distribuidorId = repo.Insert(RolesUsuarioId, FechaDeCreacion);
        } else{
          repo.Update(DistribuidorId, RolesUsuarioId, FechaDeCreacion);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (RolesDistribuidorRepository repo = new RolesDistribuidorRepository(DataContext)){
        repo.Delete(_id);
      }
    }
  

    long _id;
    public override long Id
    {
      get { return _id; }
      set { _id = value; }
    }
    
    long _distribuidorId;
    public long DistribuidorId  
    {
      get { return _distribuidorId; }         
      set { _distribuidorId = value; }
    }

    int _rolesUsuarioId;
    public int RolesUsuarioId  
    {
      get { return _rolesUsuarioId; }         
      set { _rolesUsuarioId = value; }
    }

    string _fechaDeCreacion = "";
    public string FechaDeCreacion  
    {
      get { return _fechaDeCreacion; }         
      set { 
        try
        {
          _fechaDeCreacion = DateTime.Parse(value).ToString("dd/MM/yyyy");
        }
        catch { _fechaDeCreacion = ""; }
      }
    
    }

  }
}
