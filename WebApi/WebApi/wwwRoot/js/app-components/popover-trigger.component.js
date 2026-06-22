// Requiere: floating-portal.js cargado previamente (window.FloatingPortal)
(function () {

  if (!VanillaReactive) {
    console.error('VanillaReactive no está definido.');
    return;
  }

  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent,
  } = VanillaReactive;

  const { $, setupFocusTrap } = VanillaReactive.dom;
  const FloatingPortal        = VanillaReactive.FloatingPortal;

  class PopoverTriggerComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx);
      this.portal          = null;
      this.triggerEl       = null;
      this.contentEl       = null;
      this.portalEl        = null;
      this.closeTimeout    = null;
      this.releaseFocusTrap = undefined;

      this.handleTriggerClick = () => this.toggle();
      this.handleMouseEnter   = () => {
        if (this.closeTimeout) {
          clearTimeout(this.closeTimeout);
          this.closeTimeout = null;
        }
        if (!this.state.isOpen) this.open();
      };
      this.handleMouseLeave = () => this.scheduleClose();
      this.handleKeyDown    = (e) => {
        if (e.key === 'Escape' && this.state.isOpen) this.close();
      };
      this.clickInside  = null;
      this.beforeOpen   = null;
    }

    init(ctx) {
      super.init(ctx);
      this.setState({ isOpen: false });
    }

    get openMode() {
      const raw = (this.props.mode || this.props.trigger || 'click').toLowerCase();
      return raw === 'hover' ? 'hover' : 'click';
    }

    get isHoverMode() {
      return this.openMode === 'hover';
    }

    scheduleClose() {
      if (this.closeTimeout) clearTimeout(this.closeTimeout);
      this.closeTimeout = setTimeout(() => { this.close(); }, 150);
    }

    bindPortalHoverEvents(el) {
      this.portalEl = el;
      el.addEventListener('mouseenter', this.handleMouseEnter);
      el.addEventListener('mouseleave', this.handleMouseLeave);
    }

    unbindPortalHoverEvents() {
      if (!this.portalEl) return;
      this.portalEl.removeEventListener('mouseenter', this.handleMouseEnter);
      this.portalEl.removeEventListener('mouseleave', this.handleMouseLeave);
      this.portalEl = null;
    }

    mounted() {
      if (!this.element) return;

      this.triggerEl = $('[data-popover-trigger]', this.element).one();
      this.contentEl = $('[data-popover-content]', this.element).one();

      if (!this.triggerEl || !this.contentEl) {
        console.warn('PopoverTrigger: Faltan data-popover-trigger o data-popover-content');
        return;
      }
      this.contentEl.style.display = 'none';

      if (this.isHoverMode) {
        this.triggerEl.addEventListener('mouseenter', this.handleMouseEnter);
        this.triggerEl.addEventListener('mouseleave', this.handleMouseLeave);
      } else {
        this.triggerEl.addEventListener('click', this.handleTriggerClick);
      }
      document.addEventListener('keydown', this.handleKeyDown);

      this.addCleanup(() => {
        this.triggerEl?.removeEventListener('click', this.handleTriggerClick);
        this.triggerEl?.removeEventListener('mouseenter', this.handleMouseEnter);
        this.triggerEl?.removeEventListener('mouseleave', this.handleMouseLeave);
        this.unbindPortalHoverEvents();
        if (this.closeTimeout) clearTimeout(this.closeTimeout);
        document.removeEventListener('keydown', this.handleKeyDown);
      });
    }

    destroy() {
      this.unbindPortalHoverEvents();
      if (this.closeTimeout) clearTimeout(this.closeTimeout);
      this.portal?.close();
      super.destroy();
    }

    toggle() {
      if (this.state.isOpen) this.close();
      else this.open();
    }

    open() {
      if (this.state.isOpen || !this.triggerEl || !this.contentEl) return;

      const template = `
        <div
          class="p-4 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-2xl">
          <div data-each="child in children"></div>
        </div>
      `;
      this.portal = new FloatingPortal(
        this.triggerEl,
        buildAndInterpolate(template, { children: [this.contentEl] }),
        {
          onClose: () => this.close(),
          onClickInside: (e) => {
            const shouldClose = this.clickInside?.(e);
            if (shouldClose) this.close();
          },
          onOpen: (el) => {
            if (this.isHoverMode) this.bindPortalHoverEvents(el);
            setTimeout(() => { this.beforeOpen?.(el); }, 0);
          },
          placement: this.props.placement || '',
          offset:    this.props.offset ? parseInt(this.props.offset) : 4,
        }
      );
      this.contentEl.style.display = '';
      this.state.isOpen = true;
      this.portal.open();

      if (!this.isHoverMode) {
        requestAnimationFrame(() => {
          const portalEl = this.portal?.getPortalElement();
          if (portalEl) this.releaseFocusTrap = setupFocusTrap(portalEl);
        });
      }
    }

    close() {
      if (!this.state.isOpen) return;
      this.releaseFocusTrap?.();
      this.releaseFocusTrap = undefined;
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      this.state.isOpen = false;
      this.unbindPortalHoverEvents();
      this.portal?.close();
      this.portal = null;
      if (!this.isHoverMode) this.triggerEl?.focus();
    }

    render(changedProp) {
      if (changedProp && this.element) {
        this.updateBindings();
        return this.element;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'contents';
      this.children.forEach(child => {
        if (child instanceof Node) wrapper.appendChild(child);
      });
      return wrapper;
    }
  }

  registerComponent('popover-trigger-component', PopoverTriggerComponent);

}());
