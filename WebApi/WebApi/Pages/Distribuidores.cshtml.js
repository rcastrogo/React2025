
/// <reference path="../wwwRoot/js/types/vanilla-reactive.d.ts" />

const {
  registerComponent,
  hydrateElement,
  resolveBindingValue,
  buildAndInterpolate,
  pubSub,
  services,
  dom,
  state,
} = VanillaReactive;

// Componente counter usando factory function
const CounterComponent = function (ctx) {
  const self = {
    count: 0,
    bindings: [],
    // Función para decrementar el contador
    decrement() {
      self.count--;
      self.updateBindings();
    },

    // Función para incrementar el contador
    increment() {
      self.count++;
      self.updateBindings();
    },

    // Función para actualizar los bindings
    updateBindings() {
      self.bindings.forEach(b => resolveBindingValue(b, self));
    },

    // Inicialización del componente
    init() { },

    // Renderizado del componente
    render() {
      return buildAndInterpolate(`
        <div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <button 
            on-click="decrement"
            class="px-4 py-2 bg-red-100 dark:bg-red-900/30
              text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50
              font-bold text-xl">
            <i data-icon="minus" class="size-5"></i>
          </button>
          <span
            data-bind="text:count"
            class="flex-1 text-3xl font-mono font-bold w-12 text-center dark:text-gray-100">
          </span>
          <button
            on-click="increment"
            class="px-4 py-2 bg-green-100 dark:bg-green-900/30
              text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50
              font-bold text-xl">
            <i data-icon="plus" class="size-5"></i>
          </button>
        </div>
      `, self);
    },

    // Se monta el componente
    mounted() { },

    // Se destruye el componente
    destroy() { }
  };

  return self;
};




// ==============================================================================
// Contexto de la aplicación
// ==============================================================================
const appContext = (function() {

  const {store, put, on, effect} = state.useState({
    inputValue: '',
    isDirty: false,
    length: 0,
  });

  function handleInput(el) {
    put('inputValue', el.value);
    if(el.value.trim() !== '') {
      put('isDirty', true);
      put('length', el.value.length);
    } else {
      put('isDirty', false);
      put('length', 0);
    }
  }

  on('inputValue', (value) => {
    console.log('on("inputValue")', value);
    pubSub.publish('INFO_MESSAGE_UPDATED', `Current input value: ${value}`);
  });

  effect(() => console.log('1 Effect without dependencies triggered'));
  effect(() => console.log('Effect triggered for [inputValue, isDirty]'), ['inputValue', 'isDirty']);
  effect(() => console.log('Effect triggered for isDirty'), ['isDirty']);
  effect(() => console.log('Effect triggered always'), []);

  return {
    updateBindings: function () {
      this.bindings.forEach(b => resolveBindingValue(b, this));
    },
    apiResult: '',
    showDialog: (el, ev) => {
      alert(el.id);
    },
    getEndpoints: async function () {
      const req = services.RQ.create();
      const res = await req.getFrom('/api/system/routes').invoke();
      if (typeof res === 'string') {
        console.error(res);
      } else {
        this.apiResult = JSON.stringify(res.data, null, 2);
        this.updateBindings();
        console.log(res.data);
      }
    },
    handleInput, 
    on, 
    store
  };
}());


// Inicializa la aplicación
VanillaReactive.initApp([
  () => {
    registerComponent('counter-component', CounterComponent);
    hydrateElement(document.body, appContext );
  }
]);