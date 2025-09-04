

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("Departamentos")]
  public class Departamentos : EntityList<Departamento>
  {
    public Departamentos() { }

    public Departamentos(DbContext context) : base(context) { }
        
    public Departamentos(IEnumerable<Departamento> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public Departamentos Load()
    {
      using (DepartamentosRepository repo = new DepartamentosRepository(base.DataContext))
      {
        return (Departamentos)repo.Load<Departamento>(this, repo.GetItems());
      }
    }

    public Departamentos Load(ParameterBag bag)
    {
      using (DepartamentosRepository repo = new DepartamentosRepository(base.DataContext))
      {
        return (Departamentos)repo.Load<Departamento>(this, repo.GetItems(bag));
      }
    }
  }
}
