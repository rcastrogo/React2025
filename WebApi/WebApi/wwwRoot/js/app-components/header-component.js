
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

  class HeaderComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx); 
    }

    init(value) {
      super.init(value);
    }

    render() {
      return buildAndInterpolate(`
        <div class="bg-background flex-cols justify-center">
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
      `, this);
    }
  }

  registerComponent('header-component', HeaderComponent);

}());
