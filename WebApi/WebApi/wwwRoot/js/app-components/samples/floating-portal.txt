// FloatingPortal: posiciona un elemento flotante anclado a un trigger.
// Expuesto como window.FloatingPortal para ser usado por otros componentes.
(function () {

  class FloatingPortal {

    constructor(trigger, content, options = {}) {
      this.triggerElement = trigger;
      this.portalElement = content;
      this.options = { offset: 4, ...options };
      this.rafId = 0;
      this.isQueued = false;
      this.associatedElements = new Set();

      Object.assign(this.portalElement.style, {
        position: 'fixed',
        zIndex: '9999',
        margin: '0',
      });

      this.updateBound = () => this.scheduleUpdate();
      this.clickOutsideBound = (e) => this._onClickOutside(e);

      this.resizeObs = new ResizeObserver(() => this.scheduleUpdate());
    }

    getPortalElement() {
      return this.portalElement;
    }

    open() {
      document.body.appendChild(this.portalElement);
      this.resizeObs.observe(this.triggerElement);
      window.addEventListener('resize', this.updateBound);
      document.addEventListener('scroll', this.updateBound, { capture: true, passive: true });
      document.addEventListener('click', this.clickOutsideBound, true);
      this.scheduleUpdate();
      this.options.onOpen?.(this.portalElement);
    }

    close() {
      cancelAnimationFrame(this.rafId);
      this.resizeObs.disconnect();
      this.associatedElements.clear();
      window.removeEventListener('resize', this.updateBound);
      document.removeEventListener('scroll', this.updateBound, true);
      document.removeEventListener('click', this.clickOutsideBound, true);
      if (this.portalElement.parentNode === document.body) {
        document.body.removeChild(this.portalElement);
      }
    }

    addAssociatedElement(el) {
      this.associatedElements.add(el);
    }

    removeAssociatedElement(el) {
      this.associatedElements.delete(el);
    }

    scheduleUpdate() {
      if (this.isQueued) return;
      this.isQueued = true;
      this.rafId = requestAnimationFrame(() => {
        this.isQueued = false;
        this.updatePosition();
      });
    }

    updatePosition() {
      if (this.options.type === 'tooltip') {
        this._updatePositionTooltip();
        return;
      }
      const rect = this.triggerElement.getBoundingClientRect();
      const portalHeight = this.portalElement.offsetHeight;
      const portalWidth = this.portalElement.offsetWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const offset = this.options.offset;
      const placement = this.options.placement ?? '';

      if (placement === 'right-start' || placement === 'left-start') {
        this._updatePositionSide(rect, portalWidth, portalHeight, viewportWidth, viewportHeight, offset, placement);
        return;
      }

      const spaceBelow = viewportHeight - rect.bottom;
      const shouldShowAbove = spaceBelow < portalHeight && rect.top > portalHeight;

      this.portalElement.style.minWidth = `${this.triggerElement.offsetWidth}px`;

      const shouldShowLeft = placement === 'top-end' || (rect.left + portalWidth > viewportWidth && rect.right > portalWidth);
      let left = shouldShowLeft ? rect.right - portalWidth : rect.left;

      const minLeft = offset;
      const maxLeft = Math.max(minLeft, viewportWidth - portalWidth - offset);
      left = Math.min(Math.max(left, minLeft), maxLeft);

      this.portalElement.style.left = `${left}px`;

      if (shouldShowAbove) {
        this.portalElement.style.top = `${rect.top - portalHeight - offset}px`;
        this.portalElement.classList.add('origin-bottom');
      } else {
        this.portalElement.style.top = `${rect.bottom + offset}px`;
        this.portalElement.classList.remove('origin-bottom');
      }
    }

    _updatePositionSide(rect, portalWidth, portalHeight, viewportWidth, viewportHeight, offset, placement) {
      const spaceRight = viewportWidth - rect.right;
      const preferRight = placement === 'right-start';
      const showRight = preferRight ? spaceRight >= portalWidth + offset : rect.left < portalWidth + offset;

      let left = showRight ? rect.right + offset : rect.left - portalWidth - offset;
      left = Math.min(Math.max(left, offset), viewportWidth - portalWidth - offset);

      let top = rect.top;
      if (top + portalHeight > viewportHeight - offset) {
        top = viewportHeight - portalHeight - offset;
      }
      top = Math.max(top, offset);

      this.portalElement.style.left = `${left}px`;
      this.portalElement.style.top = `${top}px`;
    }

    _updatePositionTooltip() {
      const rect     = this.triggerElement.getBoundingClientRect();
      const pH       = this.portalElement.offsetHeight;
      const pW       = this.portalElement.offsetWidth;
      const vH       = window.innerHeight;
      const vW       = window.innerWidth;
      const offset   = this.options.offset ?? 6;
      const placement = this.options.placement ?? 'top';

      const space = { top: rect.top, bottom: vH - rect.bottom, left: rect.left, right: vW - rect.right };
      const flip  = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
      const base  = placement.split('-')[0];
      const fits  = space[base] >= pH + offset;
      const side  = fits ? base : flip[base];

      const centerX = rect.left + rect.width  / 2 - pW / 2;
      const centerY = rect.top  + rect.height / 2 - pH / 2;

      let top, left;
      switch (side) {
        case 'top':    top = rect.top - pH - offset;    left = centerX; break;
        case 'bottom': top = rect.bottom + offset;      left = centerX; break;
        case 'left':   top = centerY; left = rect.left - pW - offset;  break;
        case 'right':  top = centerY; left = rect.right + offset;      break;
        default:       top = rect.top - pH - offset;    left = centerX;
      }

      left = Math.min(Math.max(left, offset), vW - pW - offset);
      top  = Math.min(Math.max(top,  offset), vH - pH - offset);

      this.portalElement.style.left = `${left}px`;
      this.portalElement.style.top  = `${top}px`;
      this.portalElement.style.minWidth = '';
    }

    _onClickOutside(e) {
      const target = e.target;
      const triggerContains = this.triggerElement.contains(target);
      const portalContains  = this.portalElement.contains(target);
      if (!triggerContains && !portalContains) {
        for (const el of this.associatedElements) {
          if (el.contains(target)) return;
        }
        this.options.onClose?.();
        return;
      }
      if (portalContains) {
        this.options.onClickInside?.(e);
      }
    }
  }

  window.FloatingPortal = FloatingPortal;

}());
