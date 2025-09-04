<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:POL="urn:Pol">
<xsl:output method="text" indent="yes"/>
<xsl:variable name="CampoClave" select="Entity/Properties/Bindables/Property[1]" />
<xsl:variable name="spPrefix" select="Entity/StoreProcedure/@prefix" />
<xsl:variable name="SPACES" select="'                                    '" />
<xsl:template match="/">
  
<!--using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Net.Aq.Seguridad;
using Net.Aq.Ng;
using Net.Aq.Datos;
using BD.Repositories;

namespace Entities
{
    [Serializable]
    public class Verificacion : Arquitectura.Negocio.EntityBase<BD.Properties.Verificacion, VerificacionesRepository>
    {
 
        #region CONSTRUCTORES

        public Verificacion()
        {

        }
        
        #endregion       

        #region PROPIEDADES

        public int Id { get; set; }
        public int NpcSolicitudId { get; set; }
        public int VerificacionId { get; set; }
        public string Usuario { get; set; }
        public string UsuarioModificacion { get; set; }
        public string FechaRel { get; set; }
        public DateTime FechaModificacion { get; set; }
        public string IndActiva { get; set; }

        #endregion

        #region BINDING

        public BD.Properties.Verificacion MapearObjetoBD(BD.Properties.Verificacion target)
        {
            target.Id = this.Id;
            target.NpcSolicitudId = this.NpcSolicitudId;
            target.VerificacionId = this.VerificacionId;
            target.Usuario = this.Usuario;
            target.UsuarioModificacion = this.UsuarioModificacion;
            target.FechaRel = this.FechaRel;
            target.FechaModificacion = this.FechaModificacion;
            target.Removed = this.IndActiva;
            return target;
        }

        public Verificacion MapearObjetoNegocio(BD.Properties.Verificacion source)
        {
            _data = source;
            this.Id = source.Id;
            this.NpcSolicitudId = source.NpcSolicitudId;
            this.VerificacionId = source.VerificacionId;
            this.Usuario = source.Usuario;
            this.UsuarioModificacion = source.UsuarioModificacion;
            this.FechaRel = source.FechaRel;
            this.FechaModificacion = source.FechaModificacion;
            this.IndActiva = source.Removed;
            return this;
        }

        #endregion

        #region CRUD

        public Verificacion Load(int id)
        {
            MapearObjetoNegocio(_repo.GetItem(id));
            return this;
        }

        public Verificacion Delete()
        {
            MapearObjetoBD(_data);
            Eliminar();
            return this;
        }

        public Verificacion Save()
        {
            MapearObjetoBD(_data);
            Guardar();
            this.Id = _data.Id;           
            return this;
        }

        #endregion

    }

    [Serializable]
    public class Verificaciones : List<Verificacion>
    {
        public Verificaciones LoadAll(){
            this.AddRange(new VerificacionesRepository().GetItems()
                                                        .Select(properties => {
                                                            return new Verificacion().MapearObjetoNegocio(properties);
                                                        }));
            return this;
        }
    }

}-->
  
  

<!--using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using System.Data;
using Net.Aq.Seguridad;
using Net.Aq.Ng;
using Net.Aq.Datos;
using Arquitectura.BBDD;

namespace BD.Repositories
{
    public class VerificacionesRepository : Repository<BD.Properties.Verificacion>
    {

        #region CONSTRUCTOR

        public VerificacionesRepository() : base() 
        {
            InicializaValores();
        }

        #endregion

        #region INICIALIZA VALORES

        protected override void InicializaValores()
        {
            _baseDatos = "SyBase";
            _tabla = "SW_REL_SOLICITUD_VERIF";
            _entidad = "SW_REL_SOLICITUD_VERIF";
            _objeto = "SW_REL_SOLICITUD_VERIF";
            _clave = "swId";
            
            _procSelect = "SW_REL_SOLICITUD_VERIF_SEL";
            _procInsert = "SW_REL_SOLICITUD_VERIF_INS";
            _procDelete = "SW_REL_SOLICITUD_VERIF_DEL";
            _procUpdate = "SW_REL_SOLICITUD_VERIF_UPD";
        }

        #endregion

        #region INICIALIZA COLUMNAS

        protected override ArrayList InicializaColumnas()
        {
            return new ArrayList(){
                new AqColumna("swId", typeof(int), System.Data.DbType.Int32),
                new AqColumna("swNpcSolicitudId", typeof(int), System.Data.DbType.Int32),
                new AqColumna("swVerificacionId", typeof(int), System.Data.DbType.Int32),
                new AqColumna("swUsuario", typeof(string), System.Data.DbType.String),
                new AqColumna("swUsuarioModificacion", typeof(string), System.Data.DbType.String),
                new AqColumna("swFechaRel", typeof(DateTime), System.Data.DbType.DateTime),
                new AqColumna("swFechaModificacion", typeof(string), System.Data.DbType.String),
                new AqColumna("swIndActiva", typeof(bool), System.Data.DbType.Boolean)
            };
        }

        #endregion


        protected override void Validar() { }

        public BD.Properties.Verificacion GetItem(int id, string usuario = "anónimo")
        {
            return (BD.Properties.Verificacion) ObtenerObjeto(usuario, id);
        }

        public BD.Properties.Verificacion[] GetItems()
        {
            return EjecutarConsulta("SELECT * FROM SW_REL_SOLICITUD_VERIF");
        }

    }
}-->  
  
  
  
<!--using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Net.Aq.Seguridad;
using Net.Aq.Ng;
using Net.Aq.Datos;

namespace BD.Properties
{
    public class Verificacion : Net.Aq.Ng.AbsAqEntidadSimpleSCPropiedades
    {

        #region PROPIEDADES

        public int Id
        {
            get { return AqFormatoDatosBD.ObtenerEntero(RowEntidad["swId"]); }
            set { EstablecerPropiedad("swId", AqFormatoDatosBD.EstablecerEntero(value)); }
        }

        public int NpcSolicitudId
        {
            get { return AqFormatoDatosBD.ObtenerEntero(RowEntidad["swNpcSolicitudId"]); }
            set { EstablecerPropiedad("swNpcSolicitudId", AqFormatoDatosBD.EstablecerEntero(value)); }
        }

        public int VerificacionId
        {
            get { return AqFormatoDatosBD.ObtenerEntero(RowEntidad["swVerificacionId"]); }
            set { EstablecerPropiedad("swVerificacionId", AqFormatoDatosBD.EstablecerEntero(value)); }
        }

        public string Usuario
        {
            get { return AqFormatoDatosBD.ObtenerTexto(RowEntidad["swUsuario"]); }
            set { EstablecerPropiedad("swUsuario", AqFormatoDatosBD.EstablecerTexto(value)); }
        }

        public string UsuarioModificacion
        {
            get { return AqFormatoDatosBD.ObtenerTexto(RowEntidad["swUsuarioModificacion"]); }
            set { EstablecerPropiedad("swUsuarioModificacion", AqFormatoDatosBD.EstablecerTexto(value)); }
        }

        public string FechaRel
        {
            get { return AqFormatoDatosBD.ObtenerTexto(RowEntidad["swFechaRel"]); }
            set { EstablecerPropiedad("swFechaRel", AqFormatoDatosBD.EstablecerTexto(value)); }
        }

        public DateTime FechaModificacion
        {
            get { return AqFormatoDatosBD.ObtenerFecha(RowEntidad["swFechaModificacion"], String.Empty); }
            set { EstablecerPropiedad("swFechaModificacion", AqFormatoDatosBD.EstablecerFecha(value)); }
        }

        public string Removed
        {
            get { return AqFormatoDatosBD.ObtenerTexto(RowEntidad["swIndActiva"]); }
            set { EstablecerPropiedad("swIndActiva", AqFormatoDatosBD.EstablecerTexto(value)); }
        }

        //public bool npcLineaPro
        //{
        //    get { return AqFormatoDatosBD.ObtenerEnteroComoBool(RowEntidad["npcLineaPro"], 1); }
        //    set { EstablecerPropiedad("npcLineaPro", AqFormatoDatosBD.EstablecerEnteroDesdeBool(value, 0, 1)); }
        //}


        #endregion

        #region INICIALIZA VALORES

        protected override void InicializaValores()
        {
            _baseDatos = "SyBase";
            _tabla = "SW_REL_SOLICITUD_VERIF";
            _entidad = "SW_REL_SOLICITUD_VERIF";            
        }

        #endregion

    }
}-->

  
  
  
  
  
  

<!--                 DELETE                                -->
<xsl:apply-templates select="Entity" mode="begin-proc">
  <xsl:with-param name="suffix" select="'_DEL'"></xsl:with-param>
</xsl:apply-templates>
  @<xsl:value-of select="$CampoClave/@dbName"/> int
AS
DELETE FROM <xsl:value-of select="Entity/@tableName"/> where <xsl:value-of select="$CampoClave/@dbName"/> = @<xsl:value-of select="$CampoClave/@dbName"/>
go
<xsl:apply-templates select="Entity" mode="end-proc">
  <xsl:with-param name="suffix" select="'_DEL'"></xsl:with-param>
</xsl:apply-templates>

<!--                 SELECT                                -->
<xsl:apply-templates select="Entity" mode="begin-proc">
  <xsl:with-param name="suffix" select="'_SEL'"></xsl:with-param>
</xsl:apply-templates>
  @<xsl:value-of select="$CampoClave/@dbName"/> int
AS
SELECT <xsl:for-each select="//Bindables/Property">
       <xsl:value-of select="@dbName"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])">, 
       </xsl:if></xsl:for-each>         
FROM <xsl:value-of select="Entity/@tableName"/> WHERE <xsl:value-of select="$CampoClave/@dbName"/> = @<xsl:value-of select="$CampoClave/@dbName"/>
go
<xsl:apply-templates select="Entity" mode="end-proc">
  <xsl:with-param name="suffix" select="'_SEL'"></xsl:with-param>
</xsl:apply-templates>  

<!--                 INSERT                                -->
<xsl:apply-templates select="Entity" mode="begin-proc">
  <xsl:with-param name="suffix" select="'_INS'"></xsl:with-param>
</xsl:apply-templates>
<xsl:for-each select="//Bindables/Property[position() &gt; 1 and position() &lt; count(../Property) - 1]">
  @<xsl:value-of select="@dbName"/><xsl:value-of select="substring($SPACES, 1, string-length($SPACES) - string-length(@dbName))" /><xsl:value-of select="@sybaseDbType"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')]) - 3">,</xsl:if>
</xsl:for-each>   
AS
declare @ID int
INSERT INTO <xsl:value-of select="Entity/@tableName"/> 
(
  <xsl:for-each select="//Bindables/Property[position() &gt; 1 and position() &lt; count(../Property)]"><xsl:value-of select="@dbName"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')]) - 2">, 
  </xsl:if></xsl:for-each>
) 
VALUES
(
  <xsl:for-each select="//Bindables/Property[position() &gt; 1 and position() &lt; count(../Property) - 1]">@<xsl:value-of select="@dbName"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')]) - 2">, 
  </xsl:if></xsl:for-each>getdate()  
)
SELECT @ID = @@identity
exec <xsl:value-of select="$spPrefix"/>_SEL @ID
go
<xsl:apply-templates select="Entity" mode="end-proc">
  <xsl:with-param name="suffix" select="'_INS'"></xsl:with-param>
</xsl:apply-templates>  

<!--                 UPDATE                                    -->
<xsl:apply-templates select="Entity" mode="begin-proc">
  <xsl:with-param name="suffix" select="'_UPD'"></xsl:with-param>
</xsl:apply-templates>
<xsl:for-each select="//Bindables/Property[position() and position() &lt; count(../Property) - 2]">
  @<xsl:value-of select="@dbName"/><xsl:value-of select="substring($SPACES, 1, string-length($SPACES) - string-length(@dbName))" /><xsl:value-of select="@sybaseDbType"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')]) - 2">, </xsl:if>
</xsl:for-each>
  @timestamp                           timestamp
AS
UPDATE <xsl:value-of select="Entity/@tableName"/>
SET 
  <xsl:for-each select="//Bindables/Property[position() &gt; 1 and position() &lt; count(../Property) - 2]">
  <xsl:value-of select="@dbName"/><xsl:value-of select="substring($SPACES, 1, string-length($SPACES) - string-length(@dbName))" />= @<xsl:value-of select="@dbName"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')]) - 4">, 
  </xsl:if></xsl:for-each>
WHERE <xsl:value-of select="$CampoClave/@dbName"/> = @<xsl:value-of select="$CampoClave/@dbName"/> AND timestamp = @timestamp

IF (SELECT (@@RowCount)) > 0
  BEGIN
    <xsl:value-of select="$spPrefix"/>_SEL @<xsl:value-of select="$CampoClave/@dbName"/>
    RETURN 0
  END
ELSE
  BEGIN
    RETURN -1
  END
go
<xsl:apply-templates select="Entity" mode="end-proc">
  <xsl:with-param name="suffix" select="'_UPD'"></xsl:with-param>
</xsl:apply-templates>  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

using System;
using Net.Ng.Hunter.Core;
using Net.Ng.Hunter.Repositories;

namespace Net.Ng.Hunter.Entities {

    [Serializable]
    public class <xsl:value-of select="Entity/@itemName"/> : Entity
    {

        #region Constructors

        public <xsl:value-of select="Entity/@itemName"/>(): base() { }

        #endregion

        <xsl:apply-templates select="//Properties/Bindables" mode="CargaDatos"/> 
        #region Properties
        <xsl:apply-templates select="//Properties/Bindables"/>
        #endregion
    }

}

using System;
using Net.Ng.Hunter.Core;
using Net.Ng.Hunter.Repositories;

namespace Net.Ng.Hunter.Entities {

    [Serializable]
    public class <xsl:value-of select="Entity/@collectionName"/> : EntityList&lt;<xsl:value-of select="Entity/@itemName"/>&gt;
    {

        #region Constructors

        public <xsl:value-of select="Entity/@collectionName"/>() {      
        }

        public <xsl:value-of select="Entity/@collectionName"/>(IAqBaseDatos dbcontext) { 
            DbContext = dbcontext;
        }

        #endregion

        public <xsl:value-of select="Entity/@collectionName"/> Load()
        {
            return __loadData(new <xsl:value-of select="Entity/@collectionName"/>Repository().GetItems());
        }

        // public <xsl:value-of select="Entity/@collectionName"/> LoadByEstado(string estado)
        // {
        //     return __loadData(new <xsl:value-of select="Entity/@collectionName"/>Repository().GetItemsByEstado(estado));
        // }

        private <xsl:value-of select="Entity/@collectionName"/> __loadData(object[][] data)
        {
            return (<xsl:value-of select="Entity/@collectionName"/>)LoadAll(this, data, AllFieldsBinder);
        }

        public static <xsl:value-of select="Entity/@itemName"/> AllFieldsBinder(object[] values, <xsl:value-of select="Entity/@itemName"/> target)
        {   
            RowReader __reader = new RowReader(values);
            <xsl:for-each select="//Bindables/Property">target.<xsl:value-of select="@name"/> = __reader.Read<xsl:apply-templates select="." mode="P4"/>();
            </xsl:for-each> 
            return target;
        }

    }
}

using System;
using Net.Ng.Hunter.Core;

namespace Net.Ng.Hunter.Repositories {

    public class <xsl:value-of select="Entity/@collectionName"/>Repository: Repository
    {
        const string QUERY_ORDERBY = "<xsl:value-of select="POL:Parametro($CampoClave/@dbName)"/> ASC";
        const string QUERY_DELETE = "DELETE FROM <xsl:value-of select="Entity/@tableName"/> WHERE <xsl:value-of select="POL:Parametro($CampoClave/@dbName)"/> = @<xsl:value-of select="$CampoClave/@dbName"/>";
        const string QUERY_SELECT = "SELECT <xsl:for-each select="//Bindables/Property"><xsl:value-of select="@dbName"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])">, </xsl:if></xsl:for-each> FROM <xsl:value-of select="Entity/@tableName"/>";
        const string QUERY_INSERT = "INSERT INTO <xsl:value-of select="Entity/@tableName"/> (<xsl:for-each select="//Bindables/Property[position() &gt; 1]"><xsl:value-of select="@dbName"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')]) - 1">, </xsl:if></xsl:for-each>) VALUES(<xsl:for-each select="//Bindables/Property[position() &gt; 1]">@<xsl:value-of select="@dbName"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')]) - 1">, </xsl:if></xsl:for-each>)";
        const string QUERY_UPDATE = "UPDATE <xsl:value-of select="Entity/@tableName"/> SET <xsl:for-each select="//Bindables/Property[position() &gt; 1]"><xsl:value-of select="@dbName"/>=@<xsl:value-of select="@dbName"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')]) - 1">, </xsl:if></xsl:for-each> WHERE <xsl:value-of select="$CampoClave/@dbName"/>=@<xsl:value-of select="$CampoClave/@dbName"/>";

        #region Constructors

        public <xsl:value-of select="Entity/@collectionName"/>Repository(): base() { }
        public <xsl:value-of select="Entity/@collectionName"/>Repository(IAqBaseDatos dbcontext) : base(dbcontext) {  }

        #endregion


        public object[][] GetItems()
        {
            // ===================================================================================================
            // Trazas
            // ===================================================================================================
            var METHOD_NAME = "<xsl:value-of select="Entity/@collectionName"/>Repository.GetItems";
            var PARAMS = "";
            TraceHelper.Log(METHOD_NAME, PARAMS);
            // ===================================================================================================
            // Operacion en la base de datos
            // ===================================================================================================
            try
            {
                return ExecuteAndLoadResultSet(DbContext.CrearConector(), QUERY_SELECT);
            }
            // ===================================================================================================
            // Gesti�n de errores y trazas
            // ===================================================================================================             
            catch (Exception ex)
            {
                TraceHelper.Log(METHOD_NAME, ex);
                throw;
            }
        }

        public object[][] GetItemsById(Int32 <xsl:value-of select="POL:Parametro($CampoClave/@name)"/>)
        {
            // ===================================================================================================
            // Trazas
            // ===================================================================================================
            var METHOD_NAME = "<xsl:value-of select="Entity/@collectionName"/>Repository.GetItemsById";
            var PARAMS = string.Join(". ", 
                new string[]{ 
                    "<xsl:value-of select="POL:Parametro($CampoClave/@name)"/>: " + <xsl:value-of select="POL:Parametro($CampoClave/@name)"/>.ToString()
                });
            TraceHelper.Log(METHOD_NAME, PARAMS);
            // ===================================================================================================
            // Operacion en la base de datos
            // ===================================================================================================
            try
            {
                var conector = DbContext.CrearConector();
                var sql = string.Format("{0} WHERE <xsl:value-of select="$CampoClave/@dbName"/> = @<xsl:value-of select="$CampoClave/@dbName"/>", QUERY_SELECT);
                conector.InsertarParametroEntrada("@<xsl:value-of select="$CampoClave/@dbName"/>", System.Data.DbType.Int32, <xsl:value-of select="POL:Parametro($CampoClave/@name)"/>);
                return ExecuteAndLoadResultSet(conector, sql);
            }
            // ===================================================================================================
            // Gesti�n de errores y trazas
            // ===================================================================================================             
            catch (Exception ex)
            {
                TraceHelper.Log(METHOD_NAME, ex);
                throw;
            }
        }

        // public object[][] GetItemsByEstado(string estado)
        // {
        //     // ===================================================================================================
        //     // Trazas
        //     // ===================================================================================================
        //     var METHOD_NAME = "<xsl:value-of select="Entity/@collectionName"/>Repository.GetItemsByEstado";
        //     var PARAMS = string.Join(". ", 
        //         new string[]{ 
        //             "estado: " + estado
        //         });
        //     TraceHelper.Log(METHOD_NAME, PARAMS);
        //     // ===================================================================================================
        //     // Operacion en la base de datos
        //     // ===================================================================================================
        //     try
        //     {
        //         var conector = DbContext.CrearConector();
        //         var sql = string.Format("{0} WHERE swEstado = @swEstado", QUERY_SELECT);
        //         conector.InsertarParametroEntrada("@swEstado", System.Data.DbType.String, estado);
        //         return ExecuteAndLoadResultSet(conector, sql);
        //     }
        //     // ===================================================================================================
        //     // Gesti�n de errores y trazas
        //     // ===================================================================================================             
        //     catch (Exception ex)
        //     {
        //         TraceHelper.Log(METHOD_NAME, ex);
        //         throw;
        //     }
        // }

        public Int32 Insert(<xsl:for-each select="//Bindables/Property[position() &gt; 1]"><xsl:apply-templates select="." mode="P2"/> <xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])-1">, 
                            </xsl:if></xsl:for-each>)
        {
            // ===================================================================================================
            // Trazas
            // ===================================================================================================
            var METHOD_NAME = "<xsl:value-of select="Entity/@collectionName"/>Repository.Insert";
            var PARAMS = string.Join(". ", 
                new string[]{ 
                    <xsl:for-each select="//Bindables/Property[position() &gt; 1]">"<xsl:value-of select="POL:Parametro(@name)"/>: " + <xsl:value-of select="POL:Parametro(@name)"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])-1">, 
                    </xsl:if></xsl:for-each>
                });
            TraceHelper.Log(METHOD_NAME, PARAMS);
            // ===================================================================================================
            // Operacion en la base de datos
            // ===================================================================================================
            try
            {
                var conector = DbContext.CrearConector();
                <xsl:for-each select="//Bindables/Property[position() &gt; 1]">conector.InsertarParametroEntrada("@<xsl:value-of select="@dbName"/>", System.Data.DbType.<xsl:apply-templates select="." mode="P3"/>, <xsl:value-of select="POL:Parametro(@name)"/>);
                </xsl:for-each>
                conector.EjecutaEscalar(QUERY_INSERT, System.Data.CommandType.Text);
                conector.LimpiarParametros();
                var newId = conector.EjecutaEscalar("SELECT @@IDENTITY", System.Data.CommandType.Text);
                return Convert.ToInt32(newId);
            }
            // ===================================================================================================
            // Gesti�n de errores y trazas
            // ===================================================================================================           
            catch (Exception ex)
            {
                TraceHelper.Log(METHOD_NAME, ex);
                throw;
            }
        }

        public Int32 Update(<xsl:for-each select="//Bindables/Property"><xsl:apply-templates select="." mode="P2"/> <xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])">, 
                          </xsl:if></xsl:for-each>)
        {
            // ===================================================================================================
            // Trazas
            // ===================================================================================================
            var METHOD_NAME = "<xsl:value-of select="Entity/@collectionName"/>Repository.Update";
            var PARAMS = string.Join(". ", 
                new string[]{ 
                    <xsl:for-each select="//Bindables/Property">"<xsl:value-of select="POL:Parametro(@name)"/>: " + <xsl:value-of select="POL:Parametro(@name)"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])">, 
                    </xsl:if></xsl:for-each>
                });
            TraceHelper.Log(METHOD_NAME, PARAMS);
            // ===================================================================================================
            // Operacion en la base de datos
            // ===================================================================================================
            try
            {
                var conector = DbContext.CrearConector();
                <xsl:for-each select="//Bindables/Property">conector.InsertarParametroEntrada("@<xsl:value-of select="@dbName"/>", System.Data.DbType.<xsl:apply-templates select="." mode="P3"/>, <xsl:value-of select="POL:Parametro(@name)"/>);
                </xsl:for-each>
                return conector.EjecutaNoQuery(QUERY_UPDATE, System.Data.CommandType.Text);
            }
            // ===================================================================================================
            // Gesti�n de errores y trazas
            // ===================================================================================================             
            catch (Exception ex)
            {
                TraceHelper.Log(METHOD_NAME, ex);
                throw;
            }
        }

        public Int32 Delete(Int32 <xsl:value-of select="POL:Parametro($CampoClave/@name)"/>)
        {
            // ===================================================================================================
            // Trazas
            // ===================================================================================================
            var METHOD_NAME = "<xsl:value-of select="Entity/@collectionName"/>Repository.Delete";
            var PARAMS = string.Join(". ", 
                new string[]{ 
                    "<xsl:value-of select="POL:Parametro($CampoClave/@name)"/>: " + <xsl:value-of select="POL:Parametro($CampoClave/@name)"/>.ToString()
                });
            TraceHelper.Log(METHOD_NAME, PARAMS);
            // ===================================================================================================
            // Operacion en la base de datos
            // ===================================================================================================
            try
            {
                var conector = DbContext.CrearConector();           
                conector.InsertarParametroEntrada("@<xsl:value-of select="$CampoClave/@dbName"/>", System.Data.DbType.Int32, <xsl:value-of select="POL:Parametro($CampoClave/@name)"/>);
                return conector.EjecutaNoQuery(QUERY_DELETE, System.Data.CommandType.Text);
            }
            // ===================================================================================================
            // Gesti�n de errores y trazas
            // =================================================================================================== 
            catch (Exception ex)
            {
                TraceHelper.Log(METHOD_NAME, ex);
                throw;
            }
        }

    }
}

</xsl:template>
  
  
<xsl:template match="//Properties/Bindables" mode="CargaDatos">    
        public <xsl:value-of select="/Entity/@itemName"/> Load(Int32 id){ 
            return EntityList&lt;<xsl:value-of select="/Entity/@itemName"/>&gt;.LoadOne(this, new <xsl:value-of select="/Entity/@collectionName"/>Repository().GetItemsById(id), <xsl:value-of select="/Entity/@collectionName"/>.AllFieldsBinder);
        }
       
        public <xsl:value-of select="/Entity/@itemName"/> Save(){
            <xsl:value-of select="/Entity/@collectionName"/>Repository repo = new <xsl:value-of select="/Entity/@collectionName"/>Repository(DbContext);
            if(_<xsl:value-of select="POL:Parametro($CampoClave/@name)"/> == 0){
              _<xsl:value-of select="POL:Parametro($CampoClave/@name)"/> = repo.Insert(<xsl:for-each select="./Property[position() &gt; 1 and not(@OmitirDal='S')]"><xsl:value-of select="@name"/><xsl:if test="position() &lt; (count(../Property[not(@OmitirDal='S')])-1)">, </xsl:if></xsl:for-each>);
            } else{
              repo.Update(<xsl:for-each select="./Property[not(@OmitirDal='S')]"><xsl:value-of select="@name"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])">, </xsl:if></xsl:for-each>);
            }
            return this;
        }
                 
        public void Delete(){
            <xsl:value-of select="/Entity/@collectionName"/>Repository repo = new <xsl:value-of select="/Entity/@collectionName"/>Repository();
            repo.Delete(_id);
            return this;
        }
  
</xsl:template>

<xsl:template match="//Properties/Bindables">
   
        <xsl:if test="count(//Bindables/Property[translate(@name,'id','ID')='ID'])=0">
        int _id;
        public override int Id
        {
          get { return _id; }
          set { _id = value; }
        }
        </xsl:if>
      
        <xsl:for-each select="Property"><xsl:text xml:space="preserve">
        </xsl:text>
        <xsl:apply-templates select="@dbType" mode="Inicializar"/> _<xsl:value-of select="POL:Parametro(@name)"/> <xsl:value-of select="POL:VBInitProperty(@dbType)"/>;<xsl:apply-templates select="."/>
        </xsl:for-each>

</xsl:template>

<xsl:template match="Property">
        public <xsl:if test="translate(@name,'id','ID')='ID'">override </xsl:if> <xsl:apply-templates select="@dbType" mode="Inicializar"/><xsl:text> </xsl:text><xsl:value-of select="@name"/>  
        {
          get { return _<xsl:value-of select="POL:Parametro(@name)"/>; }         
          <xsl:if test="string(@ReadOnly)!='true'">set { <xsl:choose><xsl:when test="POL:VBType(@dbType)!='date'">_<xsl:value-of select="POL:Parametro(@name)"/> = value; }</xsl:when><xsl:otherwise>
            try
            {
              _<xsl:value-of select="POL:Parametro(@name)"/> = DateTime.Parse(value).ToString("dd/MM/yyyy HH:mm:ss");
            }
            catch { _<xsl:value-of select="POL:Parametro(@name)"/> = ""; }
          }
        </xsl:otherwise>
        </xsl:choose></xsl:if>
        }
</xsl:template>

<xsl:template match="@dbType" mode="Inicializar">	
    <xsl:choose>	
      <xsl:when test=".='string'">string</xsl:when>
      <xsl:when test=".='DateTime'">string</xsl:when>
      <xsl:when test=".='Date'">string</xsl:when>
      <xsl:when test=".='int'">Int32</xsl:when>
      <xsl:when test=".='double'">double</xsl:when>
      <xsl:when test=".='decimal'">decimal</xsl:when>
      <xsl:when test=".='short'">short</xsl:when>
      <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
    </xsl:choose>
</xsl:template>
  
<xsl:template match="Property" mode="P2">
		<xsl:choose>
			<xsl:when test="POL:VBType(@dbType)='string'">string </xsl:when>
			<xsl:when test="POL:VBType(@dbType)='date'">string </xsl:when>
      <xsl:when test="POL:VBType(@dbType)='int'">Int32 </xsl:when>
      <xsl:when test="POL:VBType(@dbType)='decimal'">decimal </xsl:when>
			<xsl:otherwise><xsl:value-of select="@dbType"/> </xsl:otherwise>     
		</xsl:choose><xsl:value-of select="POL:Parametro(@name)"/>		    
</xsl:template>
  
<xsl:template match="Property" mode="P3">
		<xsl:choose>
			<xsl:when test="POL:VBType(@dbType)='string'">String</xsl:when>
			<xsl:when test="POL:VBType(@dbType)='date'">String</xsl:when>
      <xsl:when test="POL:VBType(@dbType)='int'">Int32</xsl:when>
      <xsl:when test="POL:VBType(@dbType)='decimal'">Decimal</xsl:when>
			<xsl:otherwise><xsl:value-of select="@dbType"/></xsl:otherwise>     
		</xsl:choose>	    
</xsl:template>

<xsl:template match="Property" mode="P4">
		<xsl:choose>
			<xsl:when test="POL:VBType(@dbType)='string'"></xsl:when>
			<xsl:when test="POL:VBType(@dbType)='date'">Date</xsl:when>
      <xsl:when test="POL:VBType(@dbType)='int'">Integer</xsl:when>
      <xsl:when test="POL:VBType(@dbType)='decimal'">Decimal</xsl:when>
			<xsl:otherwise><xsl:value-of select="@dbType"/></xsl:otherwise>     
		</xsl:choose>	    
</xsl:template>
  
<xsl:template match="@dbType">	
	<xsl:choose>	
			<xsl:when test=".='string'">string </xsl:when>
			<xsl:when test=".='date'">string </xsl:when>      
			<xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>     
	</xsl:choose>
</xsl:template>
  
<xsl:template match="Entity" mode="begin-proc">
  <xsl:param name="suffix"></xsl:param>
-- ==========================================================================================================
-- STORE PROCEDURE: <xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of>
-- ==========================================================================================================
IF OBJECT_ID('dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of>') IS NOT NULL
  BEGIN
    DROP PROCEDURE dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of>
    IF OBJECT_ID('dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of>') IS NOT NULL
      PRINT '&lt;&lt;&lt; FAILED DROPPING PROCEDURE dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of> >>>'
    ELSE
     PRINT '&lt;&lt;&lt; DROPPED PROCEDURE dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of> >>>'
  END
go
CREATE PROCEDURE dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of>
</xsl:template>
  
<xsl:template match="Entity" mode="end-proc">
  <xsl:param name="suffix"></xsl:param>
IF OBJECT_ID('dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of>') IS NOT NULL
  PRINT '&lt;&lt;&lt; CREATED PROCEDURE dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of> >>>'
ELSE
  PRINT '&lt;&lt;&lt; FAILED CREATING PROCEDURE dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of> >>>'
go

EXEC sp_procxmode 'dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of>','unchained'
go

GRANT SELECT ON dbo.<xsl:value-of select="$spPrefix"/><xsl:copy-of select="$suffix"></xsl:copy-of> TO vantive
go
</xsl:template> 
  
</xsl:stylesheet>


