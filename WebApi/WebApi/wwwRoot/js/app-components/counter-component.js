
(function () {

  if (!VanillaReactive) {
    console.error('VanillaReactive no está definido.');
    return;
  }

  const { BaseComponent, buildAndInterpolate, registerComponent } = VanillaReactive;
  const { pubSub } = VanillaReactive.services;

  class CounterComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx);
    }

    init(ctx) {
      super.init(ctx);
      const count = ~~(this.props.value || 0);
      super.setState({ count });
    }

    increment() {
      this.state.count++;
      const message = `id: ${this.instanceId}, val: ${this.state.count}`;
      pubSub.publish('app-message', message);
    }

    render(changedProp) {
      if (changedProp) console.log(changedProp);
      const template = `
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
      `;
      return buildAndInterpolate(template, this);
    }
  }

  registerComponent('counter-component', CounterComponent);

}());
