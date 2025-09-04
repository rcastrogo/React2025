

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class Distribuidor : Entity
  {

    public Distribuidor(){ }
    public Distribuidor(DbContext context) : base(context) { }
     
  
    public Distribuidor Load(){
      return Load(Id);
    }
  
    public Distribuidor Load(long id){    
      using (DistribuidoresRepository repo = new DistribuidoresRepository(DataContext)){
        return repo.LoadOne<Distribuidor>(this, repo.GetItem(id));
      }   
    }

    public Distribuidor Save(){
      using (DistribuidoresRepository repo = new DistribuidoresRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Nif, Nombre, Email, Direccion, Ciudad, PaisId, Telefono, CategoriaProductoId, TipoDocumentoId, TipoTransaccionId, MonedaId, Activo);
        } else{
          repo.Update(Id, Nif, Nombre, Email, Direccion, Ciudad, PaisId, Telefono, CategoriaProductoId, TipoDocumentoId, TipoTransaccionId, MonedaId, Activo);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (DistribuidoresRepository repo = new DistribuidoresRepository(DataContext)){
        repo.Delete(_id);
      }
    }
  

    long _id;
    public override long Id  
    {
      get { return _id; }         
      set { _id = value; }
    }

    string _nif = "";
    public string Nif  
    {
      get { return _nif; }         
      set { _nif = value; }
    }

    string _nombre = "";
    public string Nombre  
    {
      get { return _nombre; }         
      set { _nombre = value; }
    }

    string _email = "";
    public string Email  
    {
      get { return _email; }         
      set { _email = value; }
    }

    string _direccion = "";
    public string Direccion  
    {
      get { return _direccion; }         
      set { _direccion = value; }
    }

    string _ciudad = "";
    public string Ciudad  
    {
      get { return _ciudad; }         
      set { _ciudad = value; }
    }

    int _paisId;
    public int PaisId  
    {
      get { return _paisId; }         
      set { _paisId = value; }
    }

    string _telefono = "";
    public string Telefono  
    {
      get { return _telefono; }         
      set { _telefono = value; }
    }

    int _categoriaProductoId;
    public int CategoriaProductoId  
    {
      get { return _categoriaProductoId; }         
      set { _categoriaProductoId = value; }
    }

    int _tipoDocumentoId;
    public int TipoDocumentoId  
    {
      get { return _tipoDocumentoId; }         
      set { _tipoDocumentoId = value; }
    }

    int _tipoTransaccionId;
    public int TipoTransaccionId  
    {
      get { return _tipoTransaccionId; }         
      set { _tipoTransaccionId = value; }
    }

    int _monedaId;
    public int MonedaId  
    {
      get { return _monedaId; }         
      set { _monedaId = value; }
    }

    int _activo;
    public int Activo  
    {
      get { return _activo; }         
      set { _activo = value; }
    }

    string _fechaAlta = "";
    public string FechaAlta  
    {
      get { return _fechaAlta; }         
      set { 
        try
        {
          _fechaAlta = DateTime.Parse(value).ToString("dd/MM/yyyy");
        }
        catch { _fechaAlta = ""; }
      }
    
    }

  }
}
