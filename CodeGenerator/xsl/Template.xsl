<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:POL="urn:Pol">
<xsl:output method="text" indent="yes"/>
<xsl:template match="/">
<xsl:variable name="CampoClave" select="Entity/Properties/Bindables/Property[1]/@dbName" />

namespace Dal.Repositories<xsl:value-of select="Entity/@namespace"/>{

  using Dal.Core;
  using Dal.Core.Loader;
  using Dal.Core.Queries;
  using System.Collections.Generic;
  using System.Data;

  [RepoName("Dal.Repositories<xsl:value-of select="Entity/@namespace"/>.<xsl:value-of select="Entity/@collectionName"/>Repository")]
  public class <xsl:value-of select="Entity/@collectionName"/>Repository : RepositoryBase {
  
    public <xsl:value-of select="Entity/@collectionName"/>Repository(DbContext context) : base(context) { }
        
    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)                            
                            <xsl:for-each select="//Bindables/Property[position() &gt; 1 and not(@OmitirDal='S')]"> 
                            <xsl:apply-templates select="." mode="P4"/><xsl:text xml:space="preserve"> 
                            </xsl:text>                                                 
                            </xsl:for-each>.AndListOf&lt;long&gt;("Ids", "id"); 
      return GetItems(__builder);
    }                
    <xsl:apply-templates select="//Properties/Bindables"/>
  }
}

========================================================
========================================================
========================================================

namespace Negocio.Entities<xsl:value-of select="Entity/@namespace"/>
{
  using Dal.Core;
  using Dal.Repositories<xsl:value-of select="Entity/@namespace"/>;
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("<xsl:value-of select="Entity/@collectionName"/>")]
  public class <xsl:value-of select="Entity/@collectionName"/> : EntityList&lt;<xsl:value-of select="Entity/@itemName"/>&gt;
  {
    public <xsl:value-of select="Entity/@collectionName"/>() { }

    public <xsl:value-of select="Entity/@collectionName"/>(DbContext context) : base(context) { }
        
    public <xsl:value-of select="Entity/@collectionName"/>(IEnumerable&lt;<xsl:value-of select="Entity/@itemName"/>&gt; values) : base()
    {
        values.ToList().ForEach( u => Add(u));
    }

    public <xsl:value-of select="Entity/@collectionName"/> Load()
    {
      using (<xsl:value-of select="Entity/@collectionName"/>Repository repo = new <xsl:value-of select="Entity/@collectionName"/>Repository(base.DataContext))
      {
        return (<xsl:value-of select="Entity/@collectionName"/>)repo.Load&lt;<xsl:value-of select="Entity/@itemName"/>&gt;(this, repo.GetItems());
      }
    }

    public <xsl:value-of select="Entity/@collectionName"/> Load(ParameterBag bag)
    {
      using (<xsl:value-of select="Entity/@collectionName"/>Repository repo = new <xsl:value-of select="Entity/@collectionName"/>Repository(base.DataContext))
      {
        return (<xsl:value-of select="Entity/@collectionName"/>)repo.Load&lt;<xsl:value-of select="Entity/@itemName"/>&gt;(this, repo.GetItems(bag));
      }
    }
  }
}


==============================================================
==============================================================
==============================================================


namespace Negocio.Entities<xsl:value-of select="Entity/@namespace"/>
{
  using Dal.Core;
  using Dal.Repositories<xsl:value-of select="Entity/@namespace"/>;
  using Negocio.Core;
  using System;

  [Serializable()]
  public class <xsl:value-of select="Entity/@itemName"/><xsl:if test="string-length(/Entity/@tableName) > 0"> : Entity</xsl:if>
  {

    public <xsl:value-of select="Entity/@itemName"/>(){ }
    public <xsl:value-of select="Entity/@itemName"/>(DbContext context) : base(context) { }
    <xsl:apply-templates select="//Properties/Bindables" mode="CargaDatos"/>    
    <xsl:apply-templates select="//Properties/Bindables"/>
          
    <xsl:if test="string-length(/Entity/@tableName) > 0">

    </xsl:if>
  }
}
    
</xsl:template>
  
	
<xsl:template match="Import">
using <xsl:value-of select="."/>
</xsl:template>

<xsl:template match="//Properties/Bindables">
    public long Insert(<xsl:for-each select="./Property[position() &gt; 1 and not(@OmitirDal='S')]"><xsl:apply-templates select="." mode="P2"/> <xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])-1">, 
                      </xsl:if></xsl:for-each>){ 
      return Insert(new ParameterBag()<xsl:for-each select="./Property[position() &gt; 1]">
                          .Use("<xsl:value-of select="@dbName"/>", <xsl:value-of select="POL:Parametro(@name)"/>)<xsl:if test="position() + 1 = count(../Property[not(@OmitirDal='S')])">);</xsl:if>                                    
				        </xsl:for-each>                
    }
    
    public int Update(<xsl:for-each select="./Property[not(@OmitirDal='S')]"><xsl:apply-templates select="." mode="P2"/> <xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])">, 
                      </xsl:if></xsl:for-each>){
      return Update( new ParameterBag()<xsl:for-each select="Property">
                          .Use("<xsl:value-of select="@dbName"/>", <xsl:value-of select="POL:Parametro(@name)"/>)<xsl:if test="position() = count(../Property[not(@OmitirDal='S')])">);</xsl:if>
  					    </xsl:for-each>           
    }
</xsl:template>

<xsl:template match="Property" mode="P">
              .Use("<xsl:value-of select="POL:Parametro(@dbName)"/>", <xsl:value-of select="POL:Parametro(@name)"/>)	
</xsl:template>

<xsl:template match="Property" mode="P2">
		<xsl:choose>
			<xsl:when test="POL:VBType(@dbType)='string'">string </xsl:when>
			<xsl:when test="POL:VBType(@dbType)='date'">string </xsl:when>
      <xsl:when test="POL:VBType(@dbType)='int'">int </xsl:when>
      <xsl:when test="POL:VBType(@dbType)='decimal'">decimal </xsl:when>
      <xsl:when test="POL:VBType(@dbType)='bool'">bool </xsl:when>
      <xsl:when test="POL:VBType(@dbType)='long'">long </xsl:when>
			<xsl:otherwise><xsl:value-of select="@dbType"/> </xsl:otherwise>     
		</xsl:choose><xsl:value-of select="POL:Parametro(@name)"/>		    
</xsl:template>

<xsl:template match="Property" mode="P4">
		<xsl:choose>
			<xsl:when test="POL:VBType(@dbType)='string'">.And("<xsl:value-of select="@dbName"/>","<xsl:value-of select="@dbName"/>")</xsl:when>
			<xsl:when test="POL:VBType(@dbType)='date'">.AndDate("<xsl:value-of select="@dbName"/>")</xsl:when>
      <xsl:when test="POL:VBType(@dbType)='int'">.And("<xsl:value-of select="@dbName"/>")</xsl:when>
      <xsl:otherwise>// <xsl:value-of select="@dbName"/> .And <xsl:value-of select="@dbType"/></xsl:otherwise>     
		</xsl:choose>		    
</xsl:template> 
  
  
  
  <xsl:template match="//Properties/Bindables" mode="CargaDatos">

  
    public <xsl:value-of select="/Entity/@itemName"/> Load(){
      return Load(Id);
    }
  
    public <xsl:value-of select="/Entity/@itemName"/> Load(long id){    
      using (<xsl:value-of select="/Entity/@collectionName"/>Repository repo = new <xsl:value-of select="/Entity/@collectionName"/>Repository(DataContext)){
        return repo.LoadOne&lt;<xsl:value-of select="/Entity/@itemName"/>&gt;(this, repo.GetItem(id));
      }   
    }

    public <xsl:value-of select="/Entity/@itemName"/> Save(){
      using (<xsl:value-of select="/Entity/@collectionName"/>Repository repo = new <xsl:value-of select="/Entity/@collectionName"/>Repository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(<xsl:for-each select="./Property[position() &gt; 1 and not(@OmitirDal='S')]"><xsl:value-of select="@name"/><xsl:if test="position() &lt; (count(../Property[not(@OmitirDal='S')])-1)">, </xsl:if></xsl:for-each>);
        } else{
          repo.Update(<xsl:for-each select="./Property[not(@OmitirDal='S')]"><xsl:value-of select="@name"/><xsl:if test="position() &lt; count(../Property[not(@OmitirDal='S')])">, </xsl:if></xsl:for-each>);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (<xsl:value-of select="/Entity/@collectionName"/>Repository repo = new <xsl:value-of select="/Entity/@collectionName"/>Repository(DataContext)){
        repo.Delete(_id);
      }
    }
  
</xsl:template>

<xsl:template match="//Properties/Bindables">
   
    <xsl:if test="count(//Bindables/Property[translate(@name,'id','ID')='ID'])=0">
    long _id;
    public override long Id
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
      <xsl:if test="string(@ReadOnly)!='true'">set { <xsl:choose><xsl:when test="POL:VBType(@dbType)!='Date'">_<xsl:value-of select="POL:Parametro(@name)"/> = value; }</xsl:when><xsl:otherwise>
        try
        {
          _<xsl:value-of select="POL:Parametro(@name)"/> = DateTime.Parse(value).ToString("dd/MM/yyyy");
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
      <xsl:when test=".='int'">int</xsl:when>
      <xsl:when test=".='double'">double</xsl:when>
      <xsl:when test=".='decimal'">decimal</xsl:when>
      <xsl:when test=".='short'">short</xsl:when>
      <xsl:when test=".='boolean'">bool</xsl:when>
      <xsl:when test=".='long'">long</xsl:when>
      <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
    </xsl:choose>
</xsl:template>

<xsl:template match="@dbType">	
	<xsl:choose>	
			<xsl:when test=".='string'">string </xsl:when>
			<xsl:when test=".='date'">string </xsl:when>      
			<xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>     
	</xsl:choose>
</xsl:template>
  
  
  
</xsl:stylesheet>







