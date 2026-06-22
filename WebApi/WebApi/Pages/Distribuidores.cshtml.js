
/// <reference path="../wwwRoot/js/types/vanilla-reactive.d.ts" />

const { 
  registerComponent, 
  hydrateElement, 
  resolveBindingValue, 
  buildAndInterpolate, 
  pubSub, 
  services, 
  dom 
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
    init() {},

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
    mounted() {},

    // Se destruye el componente
    destroy() {}
  };

  return self;
};

// Inicializa la aplicación
VanillaReactive.initApp([
  () => {
    registerComponent('counter-component', CounterComponent);
    hydrateElement(document.body, {
      showDialog : (el, ev) => {
        alert(el.id);
      }
    });
  }
]);