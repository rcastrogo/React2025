

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("TiposDeDocumento")]
  public class TiposDeDocumento : EntityList<TipoDeDocumento>
  {
    public TiposDeDocumento() { }

    public TiposDeDocumento(DbContext context) : base(context) { }
        
    public TiposDeDocumento(IEnumerable<TipoDeDocumento> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public TiposDeDocumento Load()
    {
      using (TiposDeDocumentoRepository repo = new TiposDeDocumentoRepository(base.DataContext))
      {
        return (TiposDeDocumento)repo.Load<TipoDeDocumento>(this, repo.GetItems());
      }
    }

    public TiposDeDocumento Load(ParameterBag bag)
    {
      using (TiposDeDocumentoRepository repo = new TiposDeDocumentoRepository(base.DataContext))
      {
        return (TiposDeDocumento)repo.Load<TipoDeDocumento>(this, repo.GetItems(bag));
      }
    }
  }
}
