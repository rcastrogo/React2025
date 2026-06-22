// NotificationPanel – gestión de notificaciones toast con auto-cierre y swipe.
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

  const { $ } = VanillaReactive.dom;
  const { pubSub } = VanillaReactive.services;

  // Message topics (can be customized via window.APP_MESSAGES)
  const MESSAGES = {
    showNotification: 'APP_CONFIG.messages.app.showNotification',
    closeNotification: 'APP_CONFIG.messages.app.closeNotification',
  };

  const POSITION_CLASS_MAP = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  let notificationId = 1;

  class NotificationPanel extends BaseComponent {

    constructor(ctx) {
      super(ctx);
    }

    init(ctx) {
      super.init(ctx);
      this.addCleanup([
        pubSub.subscribe(MESSAGES.showNotification, (payload) => payload && this.show(payload)),
        pubSub.subscribe(MESSAGES.closeNotification, (id) => id && this.close(id)),
      ]);
    }

    render() {
      const position = this.props.position || 'top-right';
      const positionClass = POSITION_CLASS_MAP[position] || POSITION_CLASS_MAP['top-right'];
      const template = `
        <div data-app-notification-panel="" class="fixed z-9999 w-96 max-w-[95dvw] flex flex-col gap-2 select-none ${positionClass}">
        </div>
      `;
      return buildAndInterpolate(template, this);
    }

    show(payload) {
      let input;
      if (typeof payload === 'string') {
        input = { message: payload, type: '' };
      } else if (payload && 'message' in payload) {
        input = payload;
      } else if (payload && payload.args) {
        input = {
          type: payload.args[0] || '',
          message: payload.args[1],
          autoCloseMs: payload.args[2],
        };
      } else {
        return;
      }

      const notification = {
        id: notificationId++,
        message: input.message,
        autoCloseMs: input.autoCloseMs ?? 4000,
        type: input.type || '',
      };

      if ((notification.autoCloseMs || 0) > 0) {
        setTimeout(() => this.close(notification.id), notification.autoCloseMs);
      }

      const instance = new Notification();
      instance.init({ data: notification });
      this.element?.append(instance.render());
    }

    close(id) {
      const toastId = typeof id === 'number' ? id : (id.args ? id.args[0] : id);
      const toast = $(`#toas-${toastId}`, this.element).one();
      if (toast) {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300', 'animate-slide-out-x');
        setTimeout(() => toast.remove(), 400);
      }
    }
  }

  // ─── Individual notification card ────────────────────────────────────────────

  class Notification extends BaseComponent {

    constructor(ctx) {
      super(ctx);
      this.startX = 0;
      this.currentX = 0;
      this.swiping = false;
      this.notification = null;
    }

    init(ctx) {
      super.init(ctx);
      this.notification = ctx?.data;
    }

    resolveIcon(type) {
      if (type === 'error') return 'x';
      if (type === 'info') return 'info';
      if (type === 'warning') return 'warning';
      if (type === 'success') return 'check';
      return '';
    }

    render() {
      const icon = this.resolveIcon(this.notification.type || '');
      const template = `
        <div
          id="toas-{notification.id}"
          class="relative bg-white dark:bg-gray-800
                 border border-gray-300 dark:border-gray-700
                 rounded-lg shadow-lg p-4"
          style="touch-action: pan-y"
          on-pointerdown="onPointerDown"
          on-pointermove="onPointerMove"
          on-pointerup="onPointerUp"
          on-pointercancel="onPointerUp"
        >
          <button
            data-close-btn
            on-click="publish:APP_CONFIG.messages.app.closeNotification:global:@notification.id"
            class="
              group absolute top-3 right-3 w-8 h-8 flex items-center justify-center
              rounded-md
              text-slate-500 hover:text-slate-900
              hover:bg-slate-100
              dark:text-slate-400 dark:hover:text-white
              dark:hover:bg-slate-900
            "
            aria-label="Close notification"
          >
            <i data-icon="x" class="size-5 shrink-0"></i>
          </button>
          <div class="pr-8 flex items-start gap-3 text-sm text-gray-800 dark:text-gray-200">
            @if(notification.type)
              <i data-icon="${icon}" class="size-6 shrink-0"></i>
            @endif
            <div class="w-full wrap-break-word whitespace-pre-wrap">{notification.message | asParagraph}</div>
          </div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }

    onPointerDown(el, ev) {
      if (ev.target instanceof Element && ev.target.closest('[data-close-btn]')) return;
      this.startX = ev.clientX;
      this.swiping = true;
      el.setPointerCapture(ev.pointerId);
    }

    onPointerMove(el, ev) {
      if (!this.swiping) return;
      const delta = ev.clientX - this.startX;
      const offsetX = Math.max(-300, Math.min(300, delta));
      this.currentX = offsetX;
      el.style.transform = `translateX(${offsetX}px)`;
    }

    onPointerUp(el) {
      if (!this.swiping) return;
      this.swiping = false;
      const threshold = 100;
      const abs = Math.abs(this.currentX);
      if (abs > threshold) {
        const direction = this.currentX > 0 ? 'right' : 'left';
        this.animateSwipeClose(el, direction);
      } else {
        el.style.transition = 'transform 0.2s ease';
        el.style.transform = 'translateX(0)';
      }
    }

    animateSwipeClose(el, direction) {
      el.style.setProperty('--target', direction === 'right' ? '100vw' : '-100vw');
      el.style.setProperty('--offset', `${this.currentX}px`);
      el.classList.add('animate-slide-out-x');
      setTimeout(() => {
        pubSub.publish(MESSAGES.closeNotification, this.notification.id);
      }, 200);
    }

    asParagraph(text) {
      const lines = (text || '')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      if (lines.length === 0) return '';
      if (lines.length === 1) return lines[0];
      return lines.map(line => `<p class="indent-2">${line}</p>`).join('');
    }
  }

  registerComponent('notification-panel-component', NotificationPanel);

}());
