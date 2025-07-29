
using Dal.Core;
using Dal.Repositories;
using Dal.Core.Queries;
using Negocio.Core;
using System.Collections.Generic;
using System.Linq;

namespace Negocio.Entities
{
  [System.Xml.Serialization.XmlRoot("Usuarios")]
  public class Usuarios : EntityList<Usuario>
  {
    public Usuarios() { }

    public Usuarios(DbContext context) : base(context) { }

    
    // Constructor que acepta una colección de Usuario
    public Usuarios(IEnumerable<Usuario> usuarios) : base()
    {
        usuarios.ToList().ForEach( u => Add(u));
    }


    public Usuarios Load()
    {
      using (UsuariosRepository repo = new UsuariosRepository(base.DataContext))
      {
        return (Usuarios)repo.Load<Usuario>(this, repo.GetItems());
      }
    }

    public Usuarios Load(ParameterBag bag)
    {
      using (UsuariosRepository repo = new UsuariosRepository(base.DataContext))
      {
        return (Usuarios)repo.Load<Usuario>(this, repo.GetItems(bag));
      }
    }

  }
}
