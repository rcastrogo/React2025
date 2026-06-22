// Auto-generated bundle - Do not edit manually
// Generated: 2026-06-19T12:17:04.732Z
(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive;class CollapsibleComponent extends BaseComponent{constructor(ctx){super(ctx)}init(ctx){super.init(ctx),this.setState({expanded:this.props.expanded==="true"||!1,title:this.props.title||"Texto por defecto"})}toggle(){console.log(this.children.length),this.state.expanded=!this.state.expanded}render(changedProp){return changedProp&&this.element?(this.updateBindings(),this.element):buildAndInterpolate(`
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
          <button 
            on-click="toggle"
            class="flex w-full items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-slate-50 focus:outline-none dark:hover:bg-slate-800/50"
          >
            <div class="flex items-center gap-3">            
              <span class="font-semibold text-slate-700 dark:text-slate-200">
                {state.title}
              </span>
            </div>
            <span data-bind="show:state.expanded"><i data-icon="chevron-up" class="size-9"></i></span>
            <span data-bind="hide:state.expanded"><i data-icon="chevron-down" class="size-9"></i></span>
          </button>
          <div 
            data-each="child in children" 
            data-bind="toggle.hidden:state.expanded | not"
            class="animate-fade-in border-t border-slate-100
              bg-slate-50/30 p-4 text-slate-600
              dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
          >
          </div>
          @if(state.expanded)    
          @endif    
          @if(state.expanded === false) 
          @endif    
        </div>
      `,this)}}registerComponent("collapsible-component",CollapsibleComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive,{pubSub}=VanillaReactive.services;class CounterComponent extends BaseComponent{constructor(ctx){super(ctx)}init(ctx){super.init(ctx);const count=~~(this.props.value||0);super.setState({count})}increment(){this.state.count++;const message=`id: ${this.instanceId}, val: ${this.state.count}`;pubSub.publish("app-message",message)}render(changedProp){return changedProp&&console.log(changedProp),buildAndInterpolate(`
        <div class="bg-card rounded-xl shadow-sm border p-4 m-2 transition-all hover:shadow-md">
          <div class="flex items-center justify-between mb-3 border-b pb-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Instancia #{instanceId}</h4>
            <span class="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <div class="text-center py-4">
            <span class="text-4xl font-black text-slate-800">{state.count}</span>
            <p class="text-sm text-slate-500 mt-1">clics</p>
          </div>
          <button
            id="counter-button-{instanceId}"
            on-click="increment"
            class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white
            font-semibold rounded-lg shadow-md focus:outline-none
            focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            transition-colors">
            Incrementar
          </button>
        </div>
      `,this)}}registerComponent("counter-component",CounterComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive,tables=[{id:"departamentos",label:"Departamentos"},{id:"categorias",label:"Categorías"},{id:"estadospedidos",label:"Estados de Pedido"}];class FooterComponent extends BaseComponent{constructor(ctx){super(ctx)}get appIcons(){const icons=lucideIcons||{};return Object.entries(icons).map(([key])=>({html:`<i data-icon="${key}" class="size-5"></i>`,name:key}))}render(){return buildAndInterpolate(`
        <footer class="w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <div class="mx-auto px-6 py-6">        
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

              <div class="col-span-1 md:col-span-1">
                <div data-component="logo-component" class="text-2xl justify-start">
                  Construyendo el futuro de la web con vanilla JS y mucha cafeína.
                </div>
                <div data-each="icon in appIcons" class="flex flex-wrap gap-1 mt-4">
                  <button route-to="/" title="{icon.name}" class="app-button p-2 rounded-full">
                    {icon.html}
                  </button>                
                </div>
              </div>

              <div>
                <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Plataforma</h4>
                <ul class="space-y-2">
                  <li><a href="dashboard" route-to="dashboard" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">Dashboard</a></li>
                  <li><a href="usuario" route-to="usuarios" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">Usuarios</a></li>
                  <li><a href="home" route-to="home" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">Home</a></li>
                  <li><a href="about" route-to="about" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">About</a></li>
                  <li><a href="docs.html" target="_blank" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">Documentación</a></li>
                </ul>
              </div>

              <div>
                <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Recursos</h4>
                <ul class="space-y-2">
                  <li><a href="docs.html" target="_blank" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">Documentación</a></li>
                  <li><a href="docs.html" target="_blank" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">Guía de Estilo</a></li>                     
                </ul>
                <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 my-6">
                  Routing dinámico
                </h4>
                <ul class="space-y-2" data-each="table in tables">
                  <li>
                    <a 
                      href="/tables/{table.id}/1" 
                      route-to="tables/{table.id}/1" 
                      class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors"
                    >
                      {table.label}
                    </a>
                  </li> 
                </ul>
              </div>

              <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <h4 class="text-sm font-bold text-slate-800 dark:text-white mb-2">¿Necesitas ayuda?</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Estamos aquí para ayudarte con tu arquitectura.</p>
                <button 
                  on-click="publish:app-message:global:Solicitud de contacto"
                  class="app-button w-full">
                  Contacto
                </button>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                &copy; VanillaApp2026. Reservados todos los derechos.
              </p>
              <div class="flex gap-2">
                <button class="app-button text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors">Privacidad</button>
                <button class="app-button text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors">Términos</button>
              </div>
            </div>
          </div>
        </footer>
      `,this)}}registerComponent("footer-component",FooterComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive;class HeaderComponent extends BaseComponent{constructor(ctx){super(ctx)}init(value){super.init(value)}render(){return buildAndInterpolate(`
        <div class="flex-cols justify-center">
          <a href="index.html">
            <image src="images/logo.png" alt="Logo" class="m-2 w-full object-contain">
          </a>
          <div class="w-full flex items-center gap-2">
            <div class="flex-1">
              <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100">VanillaReactive</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Framework reactivo ligero sin dependencias
              </p>  
            </div>
            <div data-component="clock-component" class=""></div>
            <div data-component="theme-toggle-component" class=""></div> 
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <div 
              on-publish="notification::html"
              class="text-sm text-gray-600 dark:text-gray-300 p-2"
            </div>
          </div>
        </div>
      `,this)}}registerComponent("header-component",HeaderComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive;class LogoComponent extends BaseComponent{init(ctx){super.init(ctx)}render(){return buildAndInterpolate(`
        <div class="cursor-pointer flex items-center gap-2 text-2xl justify-center">
          <div class="p-2 bg-indigo-500 rounded-lg">
            <i data-icon="zap" class="size-5 text-white"></i>
          </div>
          <div class="flex flex-col items-start gap-0.5">
            <div class="font-black tracking-tighter text-slate-800 dark:text-white">
              VanillaReactive<span class="text-indigo-500">JS</span>
            </div>
            @if(children.length)
              <div class="text-xs text-gray-800 dark:text-gray-200">{parent.textContent}</div>          
            @endif
          </div>
        </div>
      `,this)}}registerComponent("logo-component",LogoComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive,{$,setupFocusTrap}=VanillaReactive.dom,FloatingPortal=VanillaReactive.FloatingPortal;class PopoverTriggerComponent extends BaseComponent{constructor(ctx){super(ctx),this.portal=null,this.triggerEl=null,this.contentEl=null,this.portalEl=null,this.closeTimeout=null,this.releaseFocusTrap=void 0,this.handleTriggerClick=()=>this.toggle(),this.handleMouseEnter=()=>{this.closeTimeout&&(clearTimeout(this.closeTimeout),this.closeTimeout=null),this.state.isOpen||this.open()},this.handleMouseLeave=()=>this.scheduleClose(),this.handleKeyDown=e=>{e.key==="Escape"&&this.state.isOpen&&this.close()},this.clickInside=null,this.beforeOpen=null}init(ctx){super.init(ctx),this.setState({isOpen:!1})}get openMode(){return(this.props.mode||this.props.trigger||"click").toLowerCase()==="hover"?"hover":"click"}get isHoverMode(){return this.openMode==="hover"}scheduleClose(){this.closeTimeout&&clearTimeout(this.closeTimeout),this.closeTimeout=setTimeout(()=>{this.close()},150)}bindPortalHoverEvents(el){this.portalEl=el,el.addEventListener("mouseenter",this.handleMouseEnter),el.addEventListener("mouseleave",this.handleMouseLeave)}unbindPortalHoverEvents(){this.portalEl&&(this.portalEl.removeEventListener("mouseenter",this.handleMouseEnter),this.portalEl.removeEventListener("mouseleave",this.handleMouseLeave),this.portalEl=null)}mounted(){if(this.element){if(this.triggerEl=$("[data-popover-trigger]",this.element).one(),this.contentEl=$("[data-popover-content]",this.element).one(),!this.triggerEl||!this.contentEl){console.warn("PopoverTrigger: Faltan data-popover-trigger o data-popover-content");return}this.contentEl.style.display="none",this.isHoverMode?(this.triggerEl.addEventListener("mouseenter",this.handleMouseEnter),this.triggerEl.addEventListener("mouseleave",this.handleMouseLeave)):this.triggerEl.addEventListener("click",this.handleTriggerClick),document.addEventListener("keydown",this.handleKeyDown),this.addCleanup(()=>{this.triggerEl?.removeEventListener("click",this.handleTriggerClick),this.triggerEl?.removeEventListener("mouseenter",this.handleMouseEnter),this.triggerEl?.removeEventListener("mouseleave",this.handleMouseLeave),this.unbindPortalHoverEvents(),this.closeTimeout&&clearTimeout(this.closeTimeout),document.removeEventListener("keydown",this.handleKeyDown)})}}destroy(){this.unbindPortalHoverEvents(),this.closeTimeout&&clearTimeout(this.closeTimeout),this.portal?.close(),super.destroy()}toggle(){this.state.isOpen?this.close():this.open()}open(){if(this.state.isOpen||!this.triggerEl||!this.contentEl)return;const template=`
        <div
          class="p-4 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-2xl">
          <div data-each="child in children"></div>
        </div>
      `;this.portal=new FloatingPortal(this.triggerEl,buildAndInterpolate(template,{children:[this.contentEl]}),{onClose:()=>this.close(),onClickInside:e=>{this.clickInside?.(e)&&this.close()},onOpen:el=>{this.isHoverMode&&this.bindPortalHoverEvents(el),setTimeout(()=>{this.beforeOpen?.(el)},0)},placement:this.props.placement||"",offset:this.props.offset?parseInt(this.props.offset):4}),this.contentEl.style.display="",this.state.isOpen=!0,this.portal.open(),this.isHoverMode||requestAnimationFrame(()=>{const portalEl=this.portal?.getPortalElement();portalEl&&(this.releaseFocusTrap=setupFocusTrap(portalEl))})}close(){this.state.isOpen&&(this.releaseFocusTrap?.(),this.releaseFocusTrap=void 0,this.closeTimeout&&(clearTimeout(this.closeTimeout),this.closeTimeout=null),this.state.isOpen=!1,this.unbindPortalHoverEvents(),this.portal?.close(),this.portal=null,this.isHoverMode||this.triggerEl?.focus())}render(changedProp){if(changedProp&&this.element)return this.updateBindings(),this.element;const wrapper=document.createElement("div");return wrapper.className="contents",this.children.forEach(child=>{child instanceof Node&&wrapper.appendChild(child)}),wrapper}}registerComponent("popover-trigger-component",PopoverTriggerComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive;class ProgressBarComponent extends BaseComponent{constructor(ctx){super(ctx),this.progress=0,this.intervalId=0,this.running=!0}init(ctx){super.init(ctx),this.initTimer()}initTimer(){const timeout=parseInt(this.props.intervalSpeed||"100"),increment=parseInt(this.props.increment||"5");this.intervalId=setInterval(()=>{this.running&&(this.progress>=100?this.progress=0:this.progress=Math.min(100,this.progress+increment),this.element?.isConnected&&this.invalidate())},timeout),this.addCleanup(()=>clearInterval(this.intervalId))}stop(){this.running=!1,this.progress=0,this.invalidate()}start(){this.running=!0}resolveProgressClasses(){return this.props.changeColor!=="true"||this.props.progressBackground?this.props.progressBackground??"bg-blue-700 dark:bg-blue-800":this.progress<50?"bg-green-500 dark:bg-green-500":this.progress<80?"bg-yellow-500 dark:bg-yellow-500":"bg-red-500 dark:bg-red-500"}render(){const showPercentage=this.props.showPercentage==="true",position=this.props.percentagePosition||"center",percentageClasses="text-[10px] font-light text-gray-700 dark:text-gray-300 whitespace-nowrap",progressClasses=this.resolveProgressClasses(),template=`
        <div class="h-1 w-full flex text-center ${position==="center"?"flex-col":"items-center"}">     
          @if(${showPercentage&&position==="left"})
            <span class="w-10 font-bold ${percentageClasses}">
              {progress}%
            </span>
          @endif
          <div class="flex-1 relative h-full">
            <div class="h-full w-full rounded-full border">
              <div 
                class="h-full rounded-full transition-all duration-100 ease-out ${progressClasses}" 
                style="width: {progress}%;"
              >
              </div>      
            </div>
            @if(${showPercentage&&position==="center"})
              <div class="text-center absolute inset-0 flex items-center justify-center">
                <span class="font-bold ${this.progress<50?"":"text-white"} ${percentageClasses}">
                  {progress}%
                </span>
              </div>
            @endif          
          </div>
          @if(${showPercentage&&position==="right"})
            <span class="w-10 font-bold ${percentageClasses}">
              {progress}%
            </span>
          @endif
        </div>
      `;return buildAndInterpolate(template,this)}}registerComponent("progress-bar-component",ProgressBarComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive,{$,build}=VanillaReactive.dom,{useState}=VanillaReactive.state,VARIANT_STYLES={underline:{base:["border-b-2","hover:text-indigo-500","dark:hover:text-indigo-400"],active:["border-indigo-500","text-indigo-600","dark:border-indigo-400","dark:text-indigo-400"],inactive:["border-transparent","text-slate-400","dark:text-slate-500"]},pills:{base:["rounded-full","border","border-transparent","mb-1","mr-2"],active:["bg-indigo-500","text-white","dark:bg-indigo-600"],inactive:["bg-transparent","text-slate-500","hover:bg-slate-100","dark:text-slate-400","dark:hover:bg-slate-800"]},segmented:{base:["border","first:rounded-l-md","last:rounded-r-md","mb-1","-ml-px","dark:border-slate-700"],active:["bg-blue-500","text-white","z-10","dark:bg-blue-600"],inactive:["bg-white","text-slate-600","hover:bg-slate-100","dark:bg-slate-800","dark:text-slate-400","dark:hover:bg-slate-700"]},boxed:{base:["px-4","py-2","text-sm","font-medium","border","border-b-0","rounded-t-md","transition-colors"],active:["bg-white","text-indigo-600","border-slate-300","dark:bg-slate-900","dark:text-indigo-400","dark:border-slate-700"],inactive:["bg-slate-50","text-slate-500","border-transparent","hover:text-slate-700","hover:bg-slate-100","dark:bg-slate-800/50","dark:text-slate-400","dark:hover:text-slate-300","dark:hover:bg-slate-800"]},lifted:{base:["px-4","py-2","text-sm","font-medium","rounded-t-lg","border-b-2","transition-all"],active:["bg-white","text-indigo-700","border-indigo-500","shadow-sm","dark:bg-slate-900","dark:text-indigo-400","dark:border-indigo-400"],inactive:["bg-transparent","text-slate-400","border-transparent","hover:text-slate-600","dark:text-slate-500","dark:hover:text-slate-300"]},soft:{base:["rounded-lg","mr-1","mb-1"],active:["bg-indigo-100","text-indigo-700","dark:bg-indigo-900/50","dark:text-indigo-300"],inactive:["text-slate-500","hover:bg-slate-100","hover:text-slate-700","dark:text-slate-400","dark:hover:bg-slate-800","dark:hover:text-slate-300"]},outline:{base:["rounded-md","border","mb-1","mr-1"],active:["border-indigo-500","text-indigo-600","bg-indigo-50","dark:border-indigo-400","dark:text-indigo-400","dark:bg-indigo-900/30"],inactive:["border-slate-200","text-slate-500","hover:border-slate-400","hover:text-slate-700","dark:border-slate-700","dark:text-slate-400","dark:hover:border-slate-500","dark:hover:text-slate-300"]}},VARIANTS=Object.keys(VARIANT_STYLES);class TabComponent extends BaseComponent{constructor(ctx){super(ctx),this.slots=null,this.buttons=[],this.tabNodes=new Map,this.setState(useState({tabs:[],activeTabId:"",variant:"default"}))}getTabDetail(tabId){const tabs=this.state.store.tabs||[],index=tabs.findIndex(tab2=>tab2.id===tabId);if(index<0)return null;const tab=tabs[index];return{id:tab.id,title:tab.title||tab.alt||tab.id,index}}raiseTabChange(tabId){const detail=this.getTabDetail(tabId);detail&&this.tabchange&&this.tabchange(detail)}raiseTabClose(tabId){const detail=this.getTabDetail(tabId);detail&&this.tabclose&&this.tabclose(detail)}setActiveTab(tabId,emitEvent=!0){const nextTabId=tabId||"";(this.state.store.activeTabId||"")!==nextTabId&&(this.state.put("activeTabId",nextTabId),emitEvent&&nextTabId&&this.raiseTabChange(nextTabId))}init(ctx){super.init(ctx);const parsedTabs=[];(this.children||[]).filter(child=>child instanceof HTMLElement&&child.dataset.id).forEach((child,index)=>{const id=child.dataset.id||`tab-${index}`;parsedTabs.push({id,title:child.dataset.title||"",icon:child.dataset.iconName||"",alt:child.dataset.alt||""}),this.tabNodes.set(id,child)}),this.addCleanup(this.state.on("activeTabId",newId=>this.updateVisuals(newId))),this.state.put("tabs",parsedTabs),this.state.put("variant",this.props.variant||"default"),parsedTabs.length>0&&this.state.put("activeTabId",this.props.selected||parsedTabs[0].id)}selectTab(el){this.setActiveTab(el.dataset.targetId||"")}setVariant(variant){VARIANTS.includes(variant)&&(this.state.put("variant",variant),this.updateVisuals(this.state.store.activeTabId))}cycleVariant(){const current=this.state.store.variant,idx=VARIANTS.indexOf(current),next=VARIANTS[(idx+1)%VARIANTS.length];this.state.put("variant",next),this.updateVisuals(this.state.store.activeTabId)}addTab(tab,content,activate=!0){const tabs=this.state.store.tabs;if(tabs.some(t=>t.id===tab.id))return;content&&this.tabNodes.set(tab.id,content),this.slots=this.slots||[];const slot=build("div",`<div id="tab-content-slot-${tab.id}" class="text-left text-slate-500 hidden"></div>`,!0);content&&slot.appendChild(content),$(".tabs-container",this.element).one()?.appendChild(slot),this.slots=[...this.slots,slot];const btn=buildAndInterpolate(this.button_template,{...this,tab});$(".butons-container",this.element).one()?.appendChild(btn),this.buttons.push(btn),this.state.put("tabs",[...tabs,tab]),activate&&this.setActiveTab(tab.id)}removeTab(tabId){const tabs=this.state.store.tabs,activeTabId=this.state.store.activeTabId,filtered=tabs.filter(t=>t.id!==tabId);if(filtered.length===tabs.length)return;if(this.slots){const id=`tab-content-slot-${tabId}`;this.slots.find(s=>s.id===id)?.remove(),this.slots=this.slots.filter(s=>s.id!==id)}this.buttons.find(b=>b.dataset.targetId===tabId)?.remove(),this.buttons=this.buttons.filter(b=>b.dataset.targetId!==tabId),this.raiseTabClose(tabId),this.tabNodes.delete(tabId),this.state.put("tabs",filtered),activeTabId===tabId&&filtered.length>0?this.setActiveTab(filtered[0].id):activeTabId===tabId&&this.setActiveTab("",!1)}updateVisuals(activeId){if(!this.element)return;const variant=this.state.store.variant||"default",styles=VARIANT_STYLES[variant]??VARIANT_STYLES.underline;this.buttons.forEach(btn=>{const isSelected=btn.dataset.targetId===activeId;btn.className="flex jj-grow jj-justify-center items-center gap-2 px-3 py-2 text-sm font-semibold outline-none transition-all cursor-pointer",btn.classList.add(...styles.base);const toAdd=isSelected?styles.active:styles.inactive,toRemove=isSelected?styles.inactive:styles.active;btn.classList.add(...toAdd),btn.classList.remove(...toRemove)}),this.slots?.forEach(slot=>{slot.classList.toggle("hidden",slot.id!==`tab-content-slot-${activeId}`)})}get button_template(){return`
        <button
          title="{tab.title | iif : @tab.title : @tab.alt}"
          data-target-id="{tab.id}"
          on-click="selectTab:{tab.id}"
          role="tab"
          class=""
        >
          @if(tab.icon)
            <i data-icon="{tab.icon}" class="inline-flex"></i> 
            @if(tab.title)<span class="hidden md:inline truncate">{tab.title}</span>@endif
          @endif
          @if(!tab.icon)
            <span class="truncate">{tab.title}</span>
          @endif
        </button>
      `}render(){const template=`
        <div class="w-full flex flex-col">
          <div class="flex flex-wrap pl-px border-b w-full" role="tablist">
            <div data-each="tab in state.store.tabs" class="contents butons-container jj-flex w-full">
              ${this.button_template}
            </div>
          </div>
          <div data-each="tab in state.store.tabs" class="contents tabs-container">
            <div id="tab-content-slot-{tab.id}" class="text-left text-slate-500 hidden"></div>
          </div>
        </div>
      `;return buildAndInterpolate(template,this)}mounted(){this.slots=$("[id^=tab-content-slot]",this.element).all(),this.slots.forEach(slot=>{const tab_id=slot.id.replace("tab-content-slot-",""),content=this.tabNodes.get(tab_id);content&&slot.appendChild(content)}),this.buttons=$('button[role="tab"]',this.element).all(),this.updateVisuals(this.state.store.activeTabId)}}registerComponent("tab-component",TabComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,pubSub,registerComponent}=VanillaReactive;class ThemeToggleComponent extends BaseComponent{constructor(ctx){super(ctx)}init(value){super.init(value);const savedTheme=localStorage.getItem("theme"),isDark=savedTheme==="dark"||!savedTheme&&window.matchMedia("(prefers-color-scheme: dark)").matches;this.setState({isDarkMode:isDark},!1),this.addCleanup([pubSub.subscribe("APP_CONFIG.messages.app.themeChanged",isDarkMode=>{this.state.isDarkMode=!!isDarkMode,this.invalidate()})])}toggleTheme(){this.state.isDarkMode=!this.state.isDarkMode,this.applyTheme(this.state.isDarkMode),pubSub.publish("APP_CONFIG.messages.app.themeChanged",this.state.isDarkMode)}applyTheme(isDark){const root=document.documentElement,css=document.createElement("style");css.appendChild(document.createTextNode(`* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
        }`)),document.head.appendChild(css),isDark?(root.classList.add("dark"),localStorage.setItem("theme","dark")):(root.classList.remove("dark"),localStorage.setItem("theme","light")),window.getComputedStyle(css).opacity,document.head.removeChild(css)}render(){return buildAndInterpolate(`
        <div class="flex items-center justify-center">
          <button on-click="toggleTheme" 
            class="
              relative flex items-center gap-2 px-3 py-2 rounded-md border
              border-gray-300 dark:border-slate-600
              bg-white dark:bg-gray-800
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors
              "
            >
          
            @if(state.isDarkMode)
              <i data-icon="sun" class="size-5 text-yellow-400"></i>
              <span class="text-sm hidden lg:block">Claro</span>
            @endif

            @if(!state.isDarkMode)
              <i data-icon="moon" class="size-5 text-indigo-500"></i>
              <span class="text-sm hidden lg:block">Oscuro</span>
            @endif

          </button>
        </div>
      `,this)}}registerComponent("theme-toggle-component",ThemeToggleComponent)})(),(function(){if(!VanillaReactive){console.error("VanillaReactive no está definido.");return}const{BaseComponent,buildAndInterpolate,registerComponent}=VanillaReactive;class TodoComponent extends BaseComponent{constructor(ctx){super(ctx)}init(value){super.init(value),this.setState({items:["Comprar leche","Pasear al perro","Estudiar JS"],input:""},!1)}addItem(){this.state.input.trim()&&(this.state.items=[...this.state.items,this.state.input],this.state.input="")}removeItem(_el,_ev,index){this.state.items=this.state.items.filter((_,i)=>i!==Number(index))}onInput(el){this.setState({input:el.value},!1)}render(){return buildAndInterpolate(`
          <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-3">
          <h3 class="font-semibold text-gray-700 dark:text-gray-200">Todo List (BaseComponent)</h3>
          <div class="flex gap-2">
              <input
              type="text"
              on-input="onInput"
              data-bind="value:state.input"
              placeholder="Nueva tarea..."
              class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button on-click="addItem" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              <i data-icon="plus" class="size-5"></i>
              </button>
          </div>
          <ul class="space-y-1" data-each="item in state.items">
              <li class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
              <span class="dark:text-gray-200">{item}</span>
              <button on-click="removeItem:{index}" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <i data-icon="x" class="size-4"></i>
              </button>
              </li>
          </ul>
          </div>
      `,this)}}registerComponent("todo-component",TodoComponent)})();
