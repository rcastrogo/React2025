
using Dal.Core;
using Dal.Repositories;
using Negocio.Core;
using System;
using System.Text.Json.Serialization;

namespace Negocio.Entities
{
  [Serializable()]
  public class Usuario : Entity
  {

    public Usuario(){ }
    public Usuario(DbContext context) : base(context) { }
   
    public Usuario Load(){
      return Load(Id);
    }

    public Usuario Load(long id){    
      using (UsuariosRepository repo = new UsuariosRepository(DataContext)){
        return repo.LoadOne<Usuario>(this, repo.GetItem(id));// Dal.Core.BasicRepository.LoadOne
      }   
    }

    public Usuario Save(){
      using (UsuariosRepository repo = new UsuariosRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Nif, Nombre, Descripcion);
        } else{
          repo.Update(Id, Nif, Nombre, Descripcion);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (UsuariosRepository repo = new UsuariosRepository(DataContext)){
        repo.Delete(_id);
      }
    }
  
    long _id;
    [JsonPropertyName("id")]
    public override long Id  
    {
      get { return _id; }         
      set { _id = value; }
    }

    String _nif;
    [JsonPropertyName("nif")]
    public String Nif  
    {
      get { return _nif; }         
      set { _nif = value; }
    }

    String _nombre;
    
    [JsonPropertyName("nombre")]
    public String Nombre  
    {
      get { return _nombre; }         
      set { _nombre = value; }
    }

    String _descripcion;
    [JsonPropertyName("descripcion")]
    public String Descripcion  
    {
      get { return _descripcion; }         
      set { _descripcion = value; }
    }

    String _fechaDeAlta;
    [JsonPropertyName("fechaDeAlta")]
    public String FechaDeAlta  
    {
      get { return _fechaDeAlta; }         
      set { _fechaDeAlta = value; }
    }

  }
}
