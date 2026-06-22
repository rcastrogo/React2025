// Componente Theme Toggle usando BaseComponent
// Este componente permite alternar entre modo claro y oscuro.
// Utiliza localStorage y la clase 'dark' en documentElement para persistir y aplicar el tema.
(function () {

  if (!VanillaReactive) {
    console.error('VanillaReactive no está definido.');
    return;
  }

  const {
    BaseComponent,
    buildAndInterpolate,
    pubSub,
    registerComponent,
  } = VanillaReactive;

  class ThemeToggleComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx); 
    }

    init(value) {
      super.init(value);
      const savedTheme = localStorage.getItem('theme');
      const isDark = savedTheme === 'dark' ||
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      this.setState({ isDarkMode: isDark }, false);
      this.addCleanup([
        pubSub.subscribe('APP_CONFIG.messages.app.themeChanged', (isDarkMode) => {
          this.state.isDarkMode = Boolean(isDarkMode);
          this.invalidate();
        })
      ]);
    }

    toggleTheme() {
      this.state.isDarkMode = !this.state.isDarkMode;
      this.applyTheme(this.state.isDarkMode);
      pubSub.publish('APP_CONFIG.messages.app.themeChanged', this.state.isDarkMode);
    }

    applyTheme(isDark) {
      const root = document.documentElement;
      const css = document.createElement('style');
      css.appendChild(
        document.createTextNode(`* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
        }`)
      );
      document.head.appendChild(css);
      if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      // Force repaint before removing the style
      window.getComputedStyle(css).opacity;
      document.head.removeChild(css);
    }

    render() {
      return buildAndInterpolate(`
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
      `, this);
    }
  }

  registerComponent('theme-toggle-component', ThemeToggleComponent);

}());
