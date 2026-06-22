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

  class ProgressBarComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx);
      this.progress = 0;
      this.intervalId = 0;
      this.running = true;
    }

    init(ctx) {
      super.init(ctx);
      this.initTimer();
    }

    initTimer() {
      const timeout   = parseInt(this.props.intervalSpeed || '100');
      const increment = parseInt(this.props.increment     || '5');
      this.intervalId = setInterval(() => {
        if (!this.running) return;
        if (this.progress >= 100)
          this.progress = 0;
        else
          this.progress = Math.min(100, this.progress + increment);
        if (this.element?.isConnected) this.invalidate();
      }, timeout);
      this.addCleanup(() => clearInterval(this.intervalId));
    }

    stop() {
      this.running = false;
      this.progress = 0;
      this.invalidate();
    }

    start() {
      this.running = true;
    }

    resolveProgressClasses() {
      if (this.props.changeColor !== 'true' || this.props.progressBackground) {
        return this.props.progressBackground ?? 'bg-blue-700 dark:bg-blue-800';
      }
      if (this.progress < 50) return 'bg-green-500 dark:bg-green-500';
      if (this.progress < 80) return 'bg-yellow-500 dark:bg-yellow-500';
      return 'bg-red-500 dark:bg-red-500';
    }

    render() {
      const showPercentage   = this.props.showPercentage === 'true';
      const position         = this.props.percentagePosition || 'center';
      const percentageClasses = 'text-[10px] font-light text-gray-700 dark:text-gray-300 whitespace-nowrap';
      const progressClasses  = this.resolveProgressClasses();

      const template = `
        <div class="h-1 w-full flex text-center ${position === 'center' ? 'flex-col' : 'items-center'}">     
          @if(${showPercentage && position === 'left'})
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
            @if(${showPercentage && position === 'center'})
              <div class="text-center absolute inset-0 flex items-center justify-center">
                <span class="font-bold ${this.progress < 50 ? '' : 'text-white'} ${percentageClasses}">
                  {progress}%
                </span>
              </div>
            @endif          
          </div>
          @if(${showPercentage && position === 'right'})
            <span class="w-10 font-bold ${percentageClasses}">
              {progress}%
            </span>
          @endif
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }

  registerComponent('progress-bar-component', ProgressBarComponent);

}());
