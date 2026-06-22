

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

  class TodoComponent extends BaseComponent { 

    constructor(ctx) {
      super(ctx); 
    }

    init(value) {
      super.init(value);
      this.setState({ items: ['Comprar leche', 'Pasear al perro', 'Estudiar JS'], input: '' }, false);
    }

    addItem() {
      if (!this.state.input.trim()) return;
      this.state.items = [...this.state.items, this.state.input];
      this.state.input = '';
    }

    removeItem(_el, _ev, index) {
      this.state.items = this.state.items.filter((_, i) => i !== Number(index));
    }

    onInput(el) {
      this.setState({ input: el.value }, false);
    }

    render() {
      return buildAndInterpolate(`
          <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-3">
          <h3 class="font-semibold text-gray-700 dark:text-gray-200">Todo List (BaseComponent)</h3>
          <div class="flex gap-2">
              <input
              type="text"
              on-input="onInput"
              data-bind="value:state.input"
              placeholder="Nueva tarea..."
              class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button on-click="addItem" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              <i data-icon="plus" class="size-5"></i>
              </button>
          </div>
          <ul class="space-y-1" data-each="item in state.items">
              <li class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
              <span class="dark:text-gray-200">{item}</span>
              <button on-click="removeItem:{index}" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <i data-icon="x" class="size-4"></i>
              </button>
              </li>
          </ul>
          </div>
      `, this);
    }
  }

  registerComponent('todo-component', TodoComponent);

}());


