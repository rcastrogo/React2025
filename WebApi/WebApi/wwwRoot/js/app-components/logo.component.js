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

  class LogoComponent extends BaseComponent {

    init(ctx) {
      super.init(ctx);
    }

    render() {
      const template = `
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
      `;
      return buildAndInterpolate(template, this);
    }
  }

  registerComponent('logo-component', LogoComponent);

}());
