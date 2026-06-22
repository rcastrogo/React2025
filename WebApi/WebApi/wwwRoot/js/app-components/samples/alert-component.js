// AlertComponent – modal dialog con soporte para título, mensaje, icono y botones.
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

  const { setupFocusTrap } = VanillaReactive.dom;
  const { pubSub } = VanillaReactive.services;

  const ALERT_SIZE_CLASS_MAP = {
    sm: 'w-[400px] max-w-[85vw] max-h-[90vh]',
    md: 'w-[600px] max-w-[75vw] max-h-[90vh]',
    lg: 'w-[75vw] max-h-[75vh]',
    xl: 'w-[90vw] max-h-[90vh]',
    fullscreen: 'fixed inset-0 w-screen h-screen max-w-none rounded-none',
    none: '',
    image: 'w-[80vw] !p-1',
  };

  const TEMPLATE = `
    <div class="app-alert-wrapper fixed inset-0 z-50 overflow-y-auto">
      <div on-click="onBackdropClick" tabindex="-1"
        class="flex min-h-full items-center justify-center p-4 text-center js-back-drop">
        <div
          role="dialog"
          class="
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            shadow-xl
            fixed
            p-2
            flex flex-col overflow-hidden animate-zoom-center
            rounded-lg
            {sizeClass}
          "
          tabindex="-1"
          style="pointer-events: auto;"
        >
          @if(title)
            <div class="shrink-0 mb-1">
              <div class="flex items-center justify-center gap-4 py-1">
                <h2 class="pl-12 flex-1 text-lg leading-none font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
                <button
                  type="button"
                  on-click="cancel"
                  aria-label="Close dialog"
                  class="
                    shrink-0
                    inline-flex items-center justify-center
                    w-8 h-8
                    rounded-md
                    text-slate-500 hover:text-slate-900
                    hover:bg-slate-100
                    dark:text-slate-400 dark:hover:text-white
                    dark:hover:bg-slate-800
                    transition-colors
                  "
                >
                  <i data-icon="x" class="size-5"></i>
                </button>
              </div>
              @if(subTitle)
                <div class="bg-slate-200 dark:bg-slate-800 h-px w-full"></div>
                <p class="text-left text-slate-900 dark:text-white my-1 pl-2">
                  {subTitle}
                </p>
              @endif
              <div class="bg-slate-200 dark:bg-slate-800 h-px w-full"></div>
            </div>
          @endif

          <div tabindex="0" class="sr-only"></div>
          <div class="flex gap-4 min-h-0">
            @if(icon)
              <div class="text-slate-900 dark:text-white">
                <div class="border p-2 rounded-md">
                  <i data-icon="{icon}" class="size-8"></i>
                </div>
              </div>
              <div class="flex group flex-1 min-h-0 overflow-y-auto items-center text-left">
                {message}
              </div>
            @endif
            @if(!icon)
              <div class="text-center w-full overflow-auto">
                {message}
              </div>
            @endif
          </div>

          @if(showFooter)
            <div class="shrink-0 mt-1">
              <div class="bg-slate-200 dark:bg-slate-800 h-px w-full"></div>
              <div class="flex justify-center gap-2 mt-2">
                <button
                  type="button"
                  on-click="cancel"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
                        bg-slate-900 dark:bg-slate-100
                        text-white dark:text-slate-900
                        hover:bg-slate-800 dark:hover:bg-slate-200
                        py-2 px-6">
                  {literals[0]}
                </button>
                @if(showConfirmButton)
                  <button
                    type="button"
                    on-click="confirm"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
                          bg-slate-900 dark:bg-slate-100
                          text-white dark:text-slate-900
                          hover:bg-slate-800 dark:hover:bg-slate-200
                          py-2 px-6">
                    {literals[1]}
                  </button>
                @endif
              </div>
            </div>
            <div
              on-publish="INFO_MESSAGE_UPDATED:local:html"
              class="text-destructive text-sm text-center p-2">
              {infoMessage}
            </div>
          @endif
        </div>
      </div>
    </div>
  `;

  class AlertComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx);
      this.disableClose = false;
      this.releaseFocusTrap = undefined;
      this.showFooter = false;
      this.showConfirmButton = false;
      this.title = '';
      this.subTitle = '';
      this.message = '';
      this.icon = '';
      this.infoMessage = '';
      this.size = 'md';
      this.literals = ['Cerrar', 'Aceptar'];
      this.onClose = undefined;
      this.onCancel = undefined;
      this.onConfirm = undefined;
    }

    get sizeClass() {
      return ALERT_SIZE_CLASS_MAP[this.size] || ALERT_SIZE_CLASS_MAP.md;
    }

    init(ctx) {
      super.init(ctx);
      if (ctx?.data && typeof ctx.data === 'object' && 'message' in ctx.data) {
        Object.assign(this, ctx.data);
        if (ctx.data.autoCloseMs) {
          setTimeout(() => this.close(), ctx.data.autoCloseMs);
        }
      }
    }

    render() {
      this.element = buildAndInterpolate(TEMPLATE, this);
      requestAnimationFrame(() => {
        if (this.element) {
          this.releaseFocusTrap = setupFocusTrap(this.element);
        }
      });
      return this.bind(this.element);
    }

    onBackdropClick(_e, event) {
      if (this.disableClose) return;
      if (event.target.classList.contains('js-back-drop')) {
        this.close();
      }
    }

    close() {
      if (this.onClose) this.onClose();
      if (this.element) this.element.remove();
      pubSub.publish('app-dialog-closed', this);
      this.releaseFocusTrap?.();
    }

    canClose() {
      return !this.disableClose;
    }

    cancel() {
      if (this.onCancel) this.onCancel();
      this.close();
    }

    confirm() {
      if (this.onConfirm && this.onConfirm(this) === false) return;
      this.close();
    }

    getContainer() {
      return this.element;
    }

    setFeedback(text) {
      this.infoMessage = text;
      this.publish('INFO_MESSAGE_UPDATED', text);
    }
  }

  registerComponent('alert-component', AlertComponent);

  // ===========================================================================
  // DialogService – servicio para abrir diálogos modales programáticamente.
  // ===========================================================================

  const BASE_Z_INDEX = 6000;

  class DialogService {

    constructor() {
      this.dialogStack = 0;
      this.backdropElement = null;

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._closeLastByEscape();
      });

      pubSub.subscribe('app-dialog-closed', () => this._removeDialog());
    }

    showProgressBar(duration) {
      pubSub.publish('http-client:loading');
      if (duration && duration > 0) {
        setTimeout(() => this.hideProgressBar(), duration);
      }
    }

    hideProgressBar() {
      pubSub.publish('http-client:loaded');
    }

    showDialog(options) {
      return this._createRef({ icon: undefined, showFooter: true, ...options });
    }

    showInfo(message, options) {
      return this._createRef({ ...options, message, icon: 'info', showFooter: false || options?.showFooter || false });
    }

    showSuccess(message, options) {
      return this._createRef({ ...options, message, icon: 'check', showFooter: options?.showFooter || false });
    }

    showWarning(message, options) {
      return this._createRef({ ...options, message, icon: 'warning', showFooter: true });
    }

    showError(message, options) {
      return this._createRef({ ...options, message, icon: 'circle-x', showFooter: true });
    }

    showLoading(message, options) {
      const html = `
        <div class="flex flex-col items-center gap-2 justify-center">
          ${message}
          <div class="h-1 w-40 overflow-hidden rounded-full bg-red-700">
            <div class="h-full w-full origin-left animate-[progress_2.5s_infinite_linear] bg-primary"></div>
          </div>
          <div class="h-px"></div>
        </div>
      `;
      return this._createRef({
        ...options, message: html, asHtml: true, disableClose: true, size: 'none'
      });
    }

    showQuestion(message, options) {
      return this._createRef({
        ...options,
        message,
        icon: 'question',
        showFooter: true,
        showConfirmButton: true,
      });
    }

    confirm(message, options) {
      return new Promise(resolve => {
        this._show({
          ...options,
          message,
          showFooter: true,
          icon: 'question',
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
          showConfirmButton: true,
        });
      });
    }

    close() {
      const last = this._getLast();
      if (last) last.close();
      return last;
    }

    forceClose() {
      while (this.close()) { /* empty */ }
    }

    // =========================================================================
    // Métodos privados
    // =========================================================================

    _createRef(options) {
      let callback = null;
      const instance = this._show({
        ...options,
        onAfterOpen: (data) => callback?.(data),
      });
      return {
        afterOpen: (cb) => { callback = cb; },
        instance,
      };
    }

    _show(options) {
      this._ensureBackdrop();
      const currentZIndex = BASE_Z_INDEX + (this.dialogStack * 2);
      this.backdropElement.style.zIndex = currentZIndex.toString();

      const instance = new AlertComponent();
      instance.init({ data: options });
      const element = instance.render();
      element.style.zIndex = (currentZIndex + 1).toString();
      document.body.appendChild(element);
      this.dialogStack++;
      queueMicrotask(() => options.onAfterOpen?.(instance));
      return instance;
    }

    _ensureBackdrop() {
      if (!this.backdropElement) {
        this.backdropElement = document.createElement('div');
        this.backdropElement.className = 'fixed inset-0 bg-black/60 transition-opacity duration-300';
        this.backdropElement.style.pointerEvents = 'auto';
        document.body.appendChild(this.backdropElement);
      }
      this.backdropElement.style.display = 'block';
    }

    _removeDialog() {
      this.dialogStack--;
      if (this.dialogStack > 0) {
        const prevZIndex = BASE_Z_INDEX + ((this.dialogStack - 1) * 2);
        this.backdropElement.style.zIndex = prevZIndex.toString();
      } else {
        this.backdropElement?.remove();
        this.backdropElement = null;
      }
    }

    _getLast() {
      if (this.dialogStack === 0) return null;
      const elements = document.querySelectorAll('.app-alert-wrapper');
      if (elements.length === 0) return null;
      const lastElement = elements[elements.length - 1];
      // @ts-ignore
      return lastElement.__componentInstance ?? null;
    }

    _closeLastByEscape() {
      const last = this._getLast();
      if (last && last.canClose()) last.close();
    }
  }

  VanillaReactive.services.dialogService = new DialogService();

}());
