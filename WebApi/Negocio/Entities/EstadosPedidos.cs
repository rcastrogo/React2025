

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("EstadosPedidos")]
  public class EstadosPedidos : EntityList<EstadoPedido>
  {
    public EstadosPedidos() { }

    public EstadosPedidos(DbContext context) : base(context) { }
        
    public EstadosPedidos(IEnumerable<EstadoPedido> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public EstadosPedidos Load()
    {
      using (EstadosPedidosRepository repo = new EstadosPedidosRepository(base.DataContext))
      {
        return (EstadosPedidos)repo.Load<EstadoPedido>(this, repo.GetItems());
      }
    }

    public EstadosPedidos Load(ParameterBag bag)
    {
      using (EstadosPedidosRepository repo = new EstadosPedidosRepository(base.DataContext))
      {
        return (EstadosPedidos)repo.Load<EstadoPedido>(this, repo.GetItems(bag));
      }
    }
  }
}
