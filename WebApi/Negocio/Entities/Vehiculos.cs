
using Dal.Core;
using Dal.Repositories;
using Dal.Core.Queries;
using Negocio.Core;

namespace Negocio.Entities
{
  [System.Xml.Serialization.XmlRoot("Vehiculos")]
  public class Vehiculos : EntityList<Vehiculo>
  {
    public Vehiculos() { }

    public Vehiculos(DbContext context) : base(context) { }

    public Vehiculos Load()
    {
      using (VehiculosRepository repo = new VehiculosRepository(base.DataContext))
      {
        return (Vehiculos)repo.Load<Vehiculo>(this, repo.GetItems());
      }
    }

    public Vehiculos Load(ParameterBag bag)
    {
      using (VehiculosRepository repo = new VehiculosRepository(base.DataContext))
      {
        return (Vehiculos)repo.Load<Vehiculo>(this, repo.GetItems(bag));
      }
    }
  }
}
