

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("RolesDistribuidor")]
  public class RolesDistribuidor : EntityList<RolDistribuidor>
  {
    public RolesDistribuidor() { }

    public RolesDistribuidor(DbContext context) : base(context) { }
        
    public RolesDistribuidor(IEnumerable<RolDistribuidor> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public RolesDistribuidor Load()
    {
      using (RolesDistribuidorRepository repo = new RolesDistribuidorRepository(base.DataContext))
      {
        return (RolesDistribuidor)repo.Load<RolDistribuidor>(this, repo.GetItems());
      }
    }

    public RolesDistribuidor Load(ParameterBag bag)
    {
      using (RolesDistribuidorRepository repo = new RolesDistribuidorRepository(base.DataContext))
      {
        return (RolesDistribuidor)repo.Load<RolDistribuidor>(this, repo.GetItems(bag));
      }
    }
  }
}
