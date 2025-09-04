

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("Paises")]
  public class Paises : EntityList<Pais>
  {
    public Paises() { }

    public Paises(DbContext context) : base(context) { }
        
    public Paises(IEnumerable<Pais> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public Paises Load()
    {
      using (PaisesRepository repo = new PaisesRepository(base.DataContext))
      {
        return (Paises)repo.Load<Pais>(this, repo.GetItems());
      }
    }

    public Paises Load(ParameterBag bag)
    {
      using (PaisesRepository repo = new PaisesRepository(base.DataContext))
      {
        return (Paises)repo.Load<Pais>(this, repo.GetItems(bag));
      }
    }
  }
}
