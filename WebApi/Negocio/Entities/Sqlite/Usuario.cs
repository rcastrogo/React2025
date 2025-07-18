
using Dal.Core;
using Dal.Repositories.Sqlite;
using Negocio.Core;
using System;

namespace Negocio.Entities.Sqlite
{
  [Serializable()]
  public class Usuario : Entity
  {

    public Usuario(){ }
    public Usuario(DbContext context) : base(context) { }
        
    public Usuario Load(long id){    
      using (UsuariosRepository repo = new UsuariosRepository(DataContext)){
        return repo.LoadOne<Usuario>(this, repo.GetItem(id));
      }   
    }

    public Usuario Save(){
      using (UsuariosRepository repo = new UsuariosRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Nombre, Valor);
        } else{
          repo.Update(Id, Nombre, Valor);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (UsuariosRepository repo = new UsuariosRepository(DataContext)){
        repo.Delete(Convert.ToInt32(_id));
      }
    }
  
    long _id;
    public override long Id  
    {
      get { return _id; }         
      set { _id = value; }
    }

    String _nombre;
    public String Nombre  
    {
      get { return _nombre; }         
      set { _nombre = value; }
    }

    long _valor;
    public long Valor 
    {
      get { return _valor; }         
      set { _valor = value; }
    }

  }
}
