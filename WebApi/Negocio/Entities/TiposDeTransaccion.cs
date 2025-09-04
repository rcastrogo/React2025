

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("TiposDeTransaccion")]
  public class TiposDeTransaccion : EntityList<TipoDeTransaccion>
  {
    public TiposDeTransaccion() { }

    public TiposDeTransaccion(DbContext context) : base(context) { }
        
    public TiposDeTransaccion(IEnumerable<TipoDeTransaccion> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public TiposDeTransaccion Load()
    {
      using (TiposDeTransaccionRepository repo = new TiposDeTransaccionRepository(base.DataContext))
      {
        return (TiposDeTransaccion)repo.Load<TipoDeTransaccion>(this, repo.GetItems());
      }
    }

    public TiposDeTransaccion Load(ParameterBag bag)
    {
      using (TiposDeTransaccionRepository repo = new TiposDeTransaccionRepository(base.DataContext))
      {
        return (TiposDeTransaccion)repo.Load<TipoDeTransaccion>(this, repo.GetItems(bag));
      }
    }
  }
}
