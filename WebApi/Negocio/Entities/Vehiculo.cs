
using Dal.Core;
using Dal.Repositories;
using Negocio.Core;
using System;

namespace Negocio.Entities
{
  [Serializable()]
  public class Vehiculo : Entity
  {

    public Vehiculo(){ }
    public Vehiculo(DbContext context) : base(context) { }
        
    public Vehiculo Load(int id){    
      using (VehiculosRepository repo = new VehiculosRepository(DataContext)){
        return repo.LoadOne<Vehiculo>(this, repo.GetItem(id));// Dal.Core.BasicRepository.LoadOne
      }   
    }

    public Vehiculo Save(){
      using (VehiculosRepository repo = new VehiculosRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Matricula, Marca, Modelo);
        } else{
          repo.Update(Id, Matricula, Marca, Modelo, FechaDeModificacion, Numero, Observaciones);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (VehiculosRepository repo = new VehiculosRepository(DataContext)){
        repo.Delete(_id);
      }
    }
  
    long _id;
    public override long Id  
    {
      get { return _id; }         
      set { _id = value; }
    }

    String _matricula;
    public String Matricula  
    {
      get { return _matricula; }         
      set { _matricula = value; }
    }

    String _marca;
    public String Marca  
    {
      get { return _marca; }         
      set { _marca = value; }
    }

    String _modelo;
    public String Modelo  
    {
      get { return _modelo; }         
      set { _modelo = value; }
    }

    String _fechaDeAlta;
    public String FechaDeAlta  
    {
      get { return _fechaDeAlta; }         
      set { _fechaDeAlta = value; }
    }

    String _fechaDeModificacion;
    public String FechaDeModificacion  
    {
      get { return _fechaDeModificacion; }         
      set { _fechaDeModificacion = value; }
    }

    int _numero;
    public int Numero 
    {
      get { return _numero; }         
      set { _numero = value; }
    }

    String _observaciones;
    public String Observaciones  
    {
      get { return _observaciones; }         
      set { _observaciones = value; }
    }

    DateTime _alta;
    public DateTime Alta  
    {
      get { return _alta; }         
      set { _alta = value; }
    }

  }
}
