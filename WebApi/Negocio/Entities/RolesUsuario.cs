

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("RolesUsuario")]
  public class RolesUsuario : EntityList<RolUsuario>
  {
    public RolesUsuario() { }

    public RolesUsuario(DbContext context) : base(context) { }
        
    public RolesUsuario(IEnumerable<RolUsuario> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public RolesUsuario Load()
    {
      using (RolesUsuarioRepository repo = new RolesUsuarioRepository(base.DataContext))
      {
        return (RolesUsuario)repo.Load<RolUsuario>(this, repo.GetItems());
      }
    }

    public RolesUsuario Load(ParameterBag bag)
    {
      using (RolesUsuarioRepository repo = new RolesUsuarioRepository(base.DataContext))
      {
        return (RolesUsuario)repo.Load<RolUsuario>(this, repo.GetItems(bag));
      }
    }
  }
}
