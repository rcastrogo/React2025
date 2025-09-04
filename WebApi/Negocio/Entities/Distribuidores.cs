

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("Distribuidores")]
  public class Distribuidores : EntityList<Distribuidor>
  {
    public Distribuidores() { }

    public Distribuidores(DbContext context) : base(context) { }
        
    public Distribuidores(IEnumerable<Distribuidor> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public Distribuidores Load()
    {
      using (DistribuidoresRepository repo = new DistribuidoresRepository(base.DataContext))
      {
        return (Distribuidores)repo.Load<Distribuidor>(this, repo.GetItems());
      }
    }

    public Distribuidores Load(ParameterBag bag)
    {
      using (DistribuidoresRepository repo = new DistribuidoresRepository(base.DataContext))
      {
        return (Distribuidores)repo.Load<Distribuidor>(this, repo.GetItems(bag));
      }
    }
  }
}
