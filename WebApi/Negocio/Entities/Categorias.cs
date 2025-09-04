

namespace Negocio.Entities
{
  using Dal.Core;
  using Dal.Repositories;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("Categorias")]
  public class Categorias : EntityList<Categoria>
  {
    public Categorias() { }

    public Categorias(DbContext context) : base(context) { }
        
    public Categorias(IEnumerable<Categoria> values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public Categorias Load()
    {
      using (CategoriasRepository repo = new CategoriasRepository(base.DataContext))
      {
        return (Categorias)repo.Load<Categoria>(this, repo.GetItems());
      }
    }

    public Categorias Load(ParameterBag bag)
    {
      using (CategoriasRepository repo = new CategoriasRepository(base.DataContext))
      {
        return (Categorias)repo.Load<Categoria>(this, repo.GetItems(bag));
      }
    }
  }
}
