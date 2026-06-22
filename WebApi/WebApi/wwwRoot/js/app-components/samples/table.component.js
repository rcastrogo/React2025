// TableComponent + ColumnFilterButtonComponent – tabla de datos avanzada con paginación, filtros, orden y grupos.
(function () {

  if (!VanillaReactive) {
    console.error('VanillaReactive no está definido.');
    return;
  }

  const { BaseComponent, buildAndInterpolate, registerComponent } = VanillaReactive;
  const { $ } = VanillaReactive.dom;
  const { storage } = VanillaReactive.state;
  const { pubSub } = VanillaReactive.services;
  const { accentNumericComparer, debounce, getUniqueValues, toDate } = VanillaReactive.utils;

  // ─── Model constants ───────────────────────────────────────────

  const TABLE_ACTIONS = {
    SELECT_ALL: 'select-all',
    CLEAR_ALL: 'clear-all',
    INVERT_SELECTION: 'invert-selection',
    SHOW_ONLY_SELECTED: 'show-only-selected',
  };

  const DEFAULT_GROUP_CLASS = 'p-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-card border-b border-slate-300 dark:border-slate-600 tracking-wide';

  // Grouping helpers – exposed on window so consumers can use them
  function numericRangeGrouping(ranges = [
    { max: 10, label: 'Menores que 10' },
    { max: 100, label: 'Del 11 al 99' },
  ]) {
    return {
      getGroupKey(value, column) {
        const n = Number(value);
        if (Number.isNaN(n)) return column.title + ': N/A';
        for (const range of ranges)
          if (n < range.max) return column.title + ': ' + range.label;
        return `${column.title}: Mayores que ${ranges[ranges.length - 1]?.max ?? 0}`;
      },
    };
  }

  function textInitialGrouping() {
    return {
      getGroupKey(value) {
        const str = String(value ?? '').trim();
        return str.length > 0 ? str[0].toUpperCase() : '(vacío)';
      },
      getGroupCaption(value, column, _rows, _data, groupRows) {
        const str = String(value ?? '').trim();
        const displayValue = str.length > 0 ? str[0].toUpperCase() : '(vacío)';
        return {
          text: `${column.title}: ${displayValue} (${groupRows.length} Elementos)`,
          className: DEFAULT_GROUP_CLASS,
        };
      },
    };
  }

  function valueGrouping(suffix = 'Elemento/s') {
    return {
      getGroupCaption(value, column, _rows, _data, groupRows) {
        return {
          text: `${column.title}: ${value ?? '(vacío)'} (${groupRows.length} ${suffix})`,
          className: DEFAULT_GROUP_CLASS,
        };
      },
    };
  }

  function dateRangeGrouping(ranges = [
    { maxDaysAgo: 7, label: 'Última semana' },
    { maxDaysAgo: 30, label: 'Último mes' },
    { maxDaysAgo: 90, label: 'Últimos 3 meses' },
    { maxDaysAgo: 365, label: 'Último año' },
  ]) {
    const getLabel = (value) => {
      const str = String(value ?? '').trim();
      if (!str || str === '-') return 'Sin fecha';
      const date = toDate(str);
      if (!date) return 'Fecha inválida';
      const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return 'Futuro';
      const matchedRange = ranges.find(r => diffDays <= r.maxDaysAgo);
      return matchedRange ? matchedRange.label : `Más de ${ranges[ranges.length - 1]?.maxDaysAgo ?? 0} días`;
    };
    return {
      getGroupKey: (value) => getLabel(value),
      getGroupCaption: (value, column, _rows, _data, groupRows) => {
        const suffix = groupRows.length === 1 ? 'Elemento' : 'Elementos';
        return {
          text: `${column.title}: ${getLabel(value)} (${groupRows.length} ${suffix})`,
          className: DEFAULT_GROUP_CLASS,
        };
      },
    };
  }

  // ─── ColumnFilterButtonComponent ─────────────────────────────────────────────

  class ColumnFilterButtonComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx);
      this.rendered = false;
      this.uniqueValues = [];
      this.selectedValues = new Set();
      this.searchText = '';
      this.column = null;
      this.data = [];
      this.filter = null;
      this.debouncedNotifyFilterChange = debounce((searchText) => {
        this.searchText = searchText;
        this.notifyFilterChange();
      }, 300);
    }

    init(ctx) {
      super.init(ctx);
      if (this.filter) {
        this.selectedValues = new Set(this.filter.selectedValues || []);
        this.searchText = this.filter.searchText || '';
      }
      this.setState({ hasActiveFilter: this.isFilterActive });
    }

    destroy() { /* empty */ }

    get shouldShowValueList() {
      return this.column?.options?.shouldShowValueList !== false;
    }

    get isFilterActive() {
      return (this.selectedValues?.size ?? 0) > 0 || (this.searchText?.length ?? 0) > 0;
    }

    clickInside = (e) => {
      const t = e.target;
      if (t instanceof Element && t.closest('[data-btn]')) return true;
      return false;
    };

    onOpenMenu = () => {
      this.uniqueValues = this.shouldShowValueList ? this.getUniqueValues() : [];
      this.updateBindings();
    };

    renderUniqueValueList(el) {
      if (!this.shouldShowValueList) { el.innerHTML = ''; return; }
      if (this.uniqueValues.length === 0) {
        el.innerHTML = `<div class="px-2 py-1 text-xs text-slate-600 dark:text-slate-300">No hay valores únicos</div>`;
        return;
      }
      if (this.rendered) return;
      this.rendered = true;
      const template = `
        <div data-each="val in uniqueValues">
          <div
            on-click="handleUniqueValueClick:@val.name"
            class="
              @if(val.isSelected) bg-indigo-100 dark:bg-indigo-900/50 @endif
              px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50
              dark:hover:bg-slate-700/50
              rounded cursor-pointer truncate">
            {val.name}
          </div>
        </div>
      `;
      const list = buildAndInterpolate(template, this);
      el.innerHTML = '';
      while (list.firstChild) el.appendChild(list.firstChild);
    }

    handleMenuClick = (_el, e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    handleSearchInput(el) {
      this.debouncedNotifyFilterChange(el.value);
    }

    handleUniqueValueClick(el, _e, value) {
      if (this.selectedValues.has(value)) {
        this.selectedValues.delete(value);
        el.classList.remove('bg-indigo-100', 'dark:bg-indigo-900/50');
      } else {
        this.selectedValues.add(value);
        el.classList.add('bg-indigo-100', 'dark:bg-indigo-900/50');
      }
      this.notifyFilterChange();
    }

    notifyFilterChange() {
      if (!this.column) return;
      // @ts-ignore
      if (this.filterChanged) this.filterChanged(this.column.key, this.searchText, this.selectedValues);
      this.state.hasActiveFilter = this.isFilterActive;
    }

    getUniqueValues() {
      if (!this.column || !this.data.length) return [];
      let uniqueValues = [];
      if (this.column.resolver &&
          'entries' in this.column.resolver &&
          typeof this.column.resolver.entries === 'function') {
        const entries = this.column.resolver.entries();
        uniqueValues = [...new Set(entries.map(item => item[1]))];
      } else if (typeof this.column.accessor === 'function') {
        const fn = this.column.accessor;
        uniqueValues = [...new Set(this.data.map(row => fn(row)))];
      } else {
        uniqueValues = getUniqueValues(
          // @ts-ignore
          this.data,
          typeof this.column.accessor === 'string' ? this.column.accessor : this.column.key
        );
      }
      uniqueValues.sort((a, b) => {
        if (a == null && b == null) return 0;
        if (a == null) return -1;
        if (b == null) return 1;
        if (typeof a === 'string' && typeof b === 'string') return accentNumericComparer(a, b);
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        return accentNumericComparer(String(a), String(b));
      });
      return uniqueValues.map(val => ({
        name: String(val),
        value: val,
        isSelected: this.selectedValues.has(String(val)),
      }));
    }

    render(changedProp) {
      if (changedProp && this.element) { this.updateBindings(); return this.element; }
      const template = `
        <div
          data-component="popover-trigger-component"
          data-placement="top-end"
          (click-inside)="clickInside"
          (before-open)="onOpenMenu"
          class="inline-block">
            <button
              data-popover-trigger
              type="button"
              on-click="handleMenuClick"
              class="app-buton relative flex h-5 w-6 items-center justify-center
              rounded-sm transition-colors hover:bg-slate-300 dark:hover:bg-slate-800">
              <i data-icon="menu" class="size-4"></i>
              <span
                data-bind="show:state.hasActiveFilter"
                class="absolute left-4.5 top-0.5 block h-1.5 w-1.5 rounded-sm bg-yellow-400">
              </span>
            </button>
            <div data-popover-content class="max-w-sm">
              <p class="
                  text-xs font-semibold text-slate-400
                  uppercase tracking-wide pt-1 pb-2 text-center
                  border-b dark:border-slate-700
                ">
                Filtrar: {column.title}
              </p>
              <div class="">
                <input
                  type="text"
                  data-bind="hide:column.options.shouldShowTextBox | equal : false"
                  placeholder="Buscar..."
                  value="{searchText}"
                  on-input="handleSearchInput"
                  class="w-full px-2 py-1.5 text-sm border rounded bg-white dark:bg-slate-700 dark:border-slate-600
                        text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500
                        focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              @if(shouldShowValueList)
                <div class="mt-2">
                  <p class="text-xs text-slate-500 dark:text-slate-400 py-1 text-center">
                    Valores únicos (<span data-bind="text:uniqueValues.length">{uniqueValues.length}</span>):
                  </p>
                  <div class="space-y-0 rounded-sm overflow-hidden border dark:border-slate-700">
                    <div
                      data-bind="fn:renderUniqueValueList"
                      class="max-h-40 overflow-auto space-y-1">
                    </div>
                  </div>
                </div>
              @endif
            </div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }

  // ─── TableComponent ────────────────────────────────────────────

  class TableComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx);
      this.data = [];
      this.actions = [];
      this.columns = [];
      this.tableKey = 'table';
      this.sortedData = [];
      this.sortDirty = true;
      this.activeFilters = new Map();

      // Column resize state
      this.isResizing = false;
      this.currentTh = null;
      this.currentResizer = null;
      this.startX = 0;
      this.startWidth = 0;
      this.skipNextSort = false;
      this.ticking = false;
      this.invertResize = false;

      this.handleMouseMove = (e) => {
        if (!this.isResizing || !this.currentTh || this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          const diffX = e.pageX - this.startX;
          const newWidth = this.startWidth + (this.invertResize ? -diffX : diffX);
          if (newWidth > 50 && this.currentTh) {
            this.currentTh.style.width = `${newWidth}px`;
          }
          this.ticking = false;
        });
      };

      this.handleMouseUp = () => {
        if (!this.isResizing) return;
        if (this.currentResizer) this.currentResizer.classList.remove('bg-blue-500/20', 'border-r-2', 'border-blue-600/20');
        this.isResizing = false;
        this.invertResize = false;
        this.currentTh = null;
        this.currentResizer = null;
        document.body.classList.remove('select-none', 'cursor-col-resize');
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        this.skipNextSort = true;
        setTimeout(() => { this.skipNextSort = false; }, 0);
        this.computeColumnsWidths();
      };
    }

    init(ctx) {
      super.init(ctx);
      this.tableKey = this.props.key || 'table';
      this.setState({
        data: this.data || [],
        actions: this.actions || [],
        columns: this.columns || [],
        selected: new Set(),
        currentPage: 1,
        pageSize: this.loadPageSize(),
        sortColumn: null,
        sortDirection: null,
        visibleColumns: new Set(),
        activeFiltersCount: 0,
        hideRowSelection: this.props.hideRowSelection === 'true',
        hideToolbar: this.props.hideToolBar === 'true',
        hideStatusbar: this.props.hideStatusbar === 'true',
        hideButtons: this.props.hideButtons === 'true',
        hideCrudButtons: this.props.hideCrudButtons === 'true',
        hidePagination: this.props.hidePagination === 'true',
        hideMenuButton: this.props.hideMenuButton === 'true',
        hideConfigButton: this.props.hideConfigButton === 'true',
        hideMenuSelection: this.props.hideMenuSelection === 'true',
        hideMenuColumns: this.props.hideMenuColumns === 'true',
        hideMenuPagination: this.props.hideMenuPagination === 'true',
        resizeColumns: this.props.resizeColumns === 'true',
      }, false);
      this.initColumns();
    }

    initColumns() {
      const columns = this.state.columns;
      const defaultVisible = columns
        .filter(c => c.isVisible !== false || c.options?.canBeRemoved === false)
        .map(c => c.key);
      const savedVisibleColumns = storage.readValue(this.visibleColumnsStorageKey(), defaultVisible);
      const savedColumnsWidths = storage.readValue(this.columnsWidthsStorageKey(), []);
      const visible = new Set(Array.isArray(savedVisibleColumns) ? savedVisibleColumns : defaultVisible);
      columns
        .filter(col => col.options?.canBeRemoved === false)
        .forEach(col => visible.add(col.key));
      this.invalidateSort();
      this.setState({
        visibleColumns: visible,
        columns: columns.map(col => ({
          ...col,
          isVisible: visible.has(col.key),
          width: savedColumnsWidths.find(cw => cw.key === col.key)?.width || col.width,
        })),
      });
    }

    setColumns(columns) {
      this.setState({ columns }, false);
      this.initColumns();
    }

    setActions(actions) {
      this.setState({ actions }, false);
    }

    showSkeletonRows() {
      if (!this.element) return;
      const template = '<div class="animate-pulse h-5 bg-gray-700/50 rounded-xs"></div>';
      $('tbody td', this.element).all().forEach(td => td.innerHTML = template);
    }

    setData(rows) {
      this.setState({
        data: rows ?? [],
        selected: new Set(),
        currentPage: 1,
        sortColumn: null,
        sortDirection: null,
        activeFiltersCount: 0,
      }, false);
      this.activeFilters = new Map();
      this.invalidateSort();
      this.firstPage();
    }

    // ─── Toolbar action handlers ──────────────────────────────────

    // @ts-ignore
    refreshData() { if (this.onRefresh) this.onRefresh(this); }

    createRow() {
      // @ts-ignore
      if (this.onCreate) {
        // @ts-ignore
        this.onCreate(this, (newItem) => {
          const data = this.state.data;
          this.setData([...data, newItem]);
        });
      }
    }

    deleteRows() {
      const ids = Array.from(this.state.selected);
      // @ts-ignore
      if (this.onDelete) {
        // @ts-ignore
        this.onDelete(this, ids, () => {
          const data = this.state.data;
          this.setData(data.filter(r => !ids.includes(r.id)));
        });
      }
    }

    editRow() {
      const ids = Array.from(this.state.selected);
      if (ids.length !== 1) return;
      const data = this.state.data;
      const item = data.find(r => r.id === ids[0]);
      if (!item) return;
      // @ts-ignore
      if (this.onEdit) {
        // @ts-ignore
        this.onEdit(this, item, (updatedItem) => {
          this.setData(data.map(r => r.id === updatedItem.id ? updatedItem : r));
        });
      }
    }

    handleMenuAction(action) {
      const data = this.state.data;
      if (action === TABLE_ACTIONS.SELECT_ALL) { this.patchSelectedRows(new Set(data.map(r => r.id))); return; }
      if (action === TABLE_ACTIONS.CLEAR_ALL) { this.patchSelectedRows(new Set()); return; }
      if (action === TABLE_ACTIONS.INVERT_SELECTION) {
        const current = this.state.selected;
        const all = data.map(r => r.id);
        this.patchSelectedRows(new Set(all.filter(id => !current.has(id))));
        return;
      }
      if (action === TABLE_ACTIONS.SHOW_ONLY_SELECTED) {
        const current = this.state.selected;
        this.invalidateSort();
        this.setState({ data: data.filter(r => current.has(r.id)), currentPage: 1 });
        return;
      }
      if (action.startsWith('page-size-')) {
        const size = parseInt(action.split('-')[2], 10);
        if (!Number.isNaN(size)) { this.setState({ pageSize: size, currentPage: 1 }); this.savePageSize(); }
        return;
      }
      // @ts-ignore
      if (this.onAction) this.onAction(this, action);
    }

    renderColumnList(el) {
      const columns = this.state.columns;
      if (!columns.length) { el.innerHTML = ''; return; }
      const html = columns.map(col => {
        const checked = col.isVisible ? 'checked' : '';
        const disabled = col.options?.canBeRemoved === false ? 'disabled' : '';
        return `
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 transition select-none rounded">
            <input type="checkbox" ${checked} ${disabled}
              data-col-key="${col.key}"
              on-change="handleToggleColumn:${col.key}"
              class="w-3 h-3 accent-indigo-500 cursor-pointer shrink-0"
            />
            <span class="text-sm opacity-60">${col.title}</span>
          </label>
        `;
      }).join('');
      const fragment = buildAndInterpolate(`<div>${html}</div>`, this);
      el.innerHTML = '';
      while (fragment.firstChild) el.appendChild(fragment.firstChild);
    }

    handleToggleColumn(_el, _e, colKey) {
      const column = this.state.columns.find(col => col.key === colKey);
      if (column?.options?.canBeRemoved === false) return;
      const next = new Set(this.state.visibleColumns);
      if (next.has(colKey)) next.delete(colKey);
      else next.add(colKey);
      this.setState({
        visibleColumns: next,
        columns: this.state.columns.map(col => ({ ...col, isVisible: next.has(col.key) })),
      });
      this.saveVisibleColumns();
    }

    handleAction(_el, _e, actionKey) {
      const actions = this.state.actions;
      const action = actions.find(a => a.key === actionKey);
      if (action?.onClick) { action.onClick(); return; }
      this.handleMenuAction(actionKey);
    }

    handlePageSize(el, _e, pageSize) {
      Array.from(el.parentNode.children).forEach(el => {
        el.classList.remove('bg-slate-200', 'dark:bg-slate-600/50');
      });
      el.classList.add('bg-slate-200', 'dark:bg-slate-600/50');
      this.handleMenuAction('page-size-' + parseInt(pageSize, 10));
    }

    toggleSort(_el, _e, columnKey) {
      if (this.skipNextSort) return;
      const columns = this.state.columns;
      const col = columns.find(c => c.key === columnKey);
      if (!col?.sorter) return;
      const current = this.state.sortColumn;
      this.invalidateSort();
      if (current === columnKey) {
        const dir = this.state.sortDirection;
        this.setState({ sortDirection: dir === 'asc' ? 'desc' : dir === 'desc' ? null : 'asc', currentPage: 1 });
      } else {
        this.setState({ sortColumn: columnKey, sortDirection: 'asc', currentPage: 1 });
      }
    }

    // @ts-ignore
    handleRowClick(_el, _e, id) { if (this.onRowClick) this.onRowClick(this, id); }

    handleGroupClick(el, _e, groupKey) {
      const icons = $('svg', el).all();
      icons.forEach(icon => icon.classList.remove('hidden'));
      if (el.classList.contains('group-collapsed')) {
        el.classList.remove('group-collapsed');
        icons[0]?.classList.add('hidden');
        $(`[data-group="${groupKey}"]`, this.element).all().forEach(row => row.classList.remove('hidden'));
      } else {
        el.classList.add('group-collapsed');
        icons[1]?.classList.add('hidden');
        $(`[data-group="${groupKey}"]`, this.element).all().forEach(row => row.classList.add('hidden'));
      }
    }

    firstPage() { this.state.currentPage = 1; }
    lastPage() { this.state.currentPage = this.getTotalPages(); }
    prevPage() { if (this.state.currentPage > 1) this.state.currentPage = this.state.currentPage - 1; }
    nextPage() { const total = this.getTotalPages(); if (this.state.currentPage < total) this.state.currentPage = this.state.currentPage + 1; }

    goToPage(el) {
      const value = parseInt(el.value || '1', 10);
      const total = this.getTotalPages();
      if (value >= 1 && value <= total) this.state.currentPage = value;
    }

    setPageSize(el) {
      const value = parseInt(el.value || '10', 10);
      this.setState({ pageSize: Number.isNaN(value) ? 10 : value, currentPage: 1 });
      this.savePageSize();
    }

    toggleRow(_el, _e, id) {
      const next = new Set(this.state.selected);
      if (next.has(id)) next.delete(id); else next.add(id);
      this.patchSelectedRows(next);
    }

    patchSelectedRows(selected) {
      this.setState({ selected }, false);
      const rows = $('[data-row]', this.element).all();
      rows.forEach(row => {
        const rowId = row.id.replace('row-', '');
        const isSelected = selected.has(rowId) || selected.has(Number(rowId));
        row.classList.remove('bg-blue-50!', 'dark:bg-blue-900/20!');
        if (isSelected) row.classList.add('bg-blue-50!', 'dark:bg-blue-900/20!');
        const checkbox = $('input[type="checkbox"]', row).one();
        // @ts-ignore
        if (checkbox) checkbox.checked = isSelected;
      });
      this.patchStatus();
      this.patchToolbar();
    }

    selectAll(el) {
      const data = this.state.data;
      const next = el.checked ? new Set(data.map(r => r.id)) : new Set();
      this.patchSelectedRows(next);
    }

    toggleColumn(_el, _e, columnKey) {
      const next = new Set(this.state.visibleColumns);
      if (next.has(columnKey)) next.delete(columnKey); else next.add(columnKey);
      this.setState({
        visibleColumns: next,
        columns: this.state.columns.map(col => ({ ...col, isVisible: next.has(col.key) })),
      });
      this.saveVisibleColumns();
    }

    render(changedProp) {
      if (changedProp && this.element) {
        this.patchStatus();
        this.rebuildHeaders();
        this.rebuildRows();
        this.patchToolbar();
        this.updateBindings();
        return this.element;
      }
      return buildAndInterpolate(this.buildTemplate(), this);
    }

    // ─── Incremental DOM patches ──────────────────────────────────

    patchStatus() {
      const el = $('[data-table-status]', this.element || undefined).one();
      if (el) el.innerHTML = this.buildStatusHtml();
    }

    rebuildHeaders() {
      if (!this.element) return;
      const thead = this.element.querySelector('thead');
      if (!thead) return;
      const data = this.state.data;
      const selected = this.state.selected;
      const allChecked = data.length > 0 && selected.size === data.length;
      const newThead = buildAndInterpolate(
        `<table><thead><tr>
          ${this.state.hideRowSelection ? '<th class="px-3 py-2 border-b size-8 max-w-8 min-w-8"></th>' : `
          <th class="px-3 py-2 border-b w-10 max-w-10 min-w-10">
            <input type="checkbox" on-change="selectAll" class="cursor-pointer" ${allChecked ? 'checked' : ''} />
          </th>`}
          ${this.buildHeaderHtml()}
        </tr></thead></table>`,
        this,
      );
      thead.replaceWith(newThead.querySelector('thead'));
    }

    rebuildRows() {
      if (!this.element) return;
      const tbody = this.element.querySelector('tbody');
      if (!tbody) return;
      const newTable = buildAndInterpolate(`<table><tbody>${this.buildBodyHtml()}</tbody></table>`, this);
      tbody.replaceWith(newTable.querySelector('tbody'));
    }

    patchToolbar() {
      if (!this.element) return;
      const currentPage = this.state.currentPage;
      const totalPages = this.getTotalPages();
      const selected = this.state.selected;
      const isFirst = currentPage === 1;
      const isLast = currentPage === totalPages;
      const btn = (key) => this.element.querySelector(`[data-btn="${key}"]`);
      btn('first')?.toggleAttribute('disabled', isFirst);
      btn('prev')?.toggleAttribute('disabled', isFirst);
      btn('next')?.toggleAttribute('disabled', isLast);
      btn('last')?.toggleAttribute('disabled', isLast);
      btn('edit')?.toggleAttribute('disabled', selected.size !== 1);
      btn('delete')?.toggleAttribute('disabled', selected.size === 0);
      for (const action of this.state.actions) {
        if (action.show === 'button' || action.show === 'both') {
          btn(action.key)?.toggleAttribute('disabled', action.enabledWhen ? !action.enabledWhen(selected) : false);
        }
      }
      const pageInput = this.element.querySelector('[data-page-input]');
      // @ts-ignore
      if (pageInput) pageInput.value = String(currentPage);
      // @ts-ignore
      if (this.onUpdateUi) {
        const payload = {
          toolbarContainer: $('[data-table-toolbar]', this.element).one(),
          statusContainer: $('[data-table-status]', this.element).one(),
          buttonsContainer: $('[data-table-buttons]', this.element).one(),
          buttons: {
            crud: $('[data-crud]', this.element).all(),
            custom: $('[data-custom]', this.element).all(),
            pagination: $('[data-pagination]', this.element).all(),
            menu: $('.js-menu', this.element).all(),
          },
          status: this.buildStatusHtml(),
        };
        // @ts-ignore
        this.onUpdateUi(payload);
      }
    }

    clickInside = (e) => {
      const t = e.target;
      if (t instanceof Element && t.closest('[data-btn]')) return true;
      return false;
    };

    onOpenMenu = (el) => {
      const rows = this.state.data;
      const selected = this.state.selected;
      const buttons = $('[data-btn]', el).all();
      const actions = this.state.actions;
      buttons.forEach(btn => {
        const key = btn.getAttribute('data-btn');
        if (key === 'select-all') {
          btn.toggleAttribute('disabled', rows.length === 0 || selected.size === rows.length);
        } else if (key === 'clear-all') {
          btn.toggleAttribute('disabled', selected.size === 0);
        } else if (key === 'invert-selection') {
          btn.toggleAttribute('disabled', selected.size === 0 || selected.size === rows.length);
        } else if (key === 'show-only-selected') {
          btn.toggleAttribute('disabled', selected.size === 0 || selected.size === rows.length);
        } else if (key && key.startsWith('page-size-')) {
          const size = parseInt(key.split('-')[2], 10);
          if (size === this.state.pageSize) btn.classList.add('bg-slate-200', 'dark:bg-slate-600/50');
          else btn.classList.remove('bg-slate-200', 'dark:bg-slate-600/50');
        } else {
          const action = actions.find(a => a.key === key);
          if (action) btn.toggleAttribute('disabled', action.enabledWhen ? !action.enabledWhen(selected) : false);
        }
      });
    };

    handleFilterChanged(columnKey, searchText, selectedValues) {
      if (searchText.length === 0 && selectedValues.size === 0) {
        this.activeFilters.delete(columnKey);
      } else {
        this.activeFilters.set(columnKey, { searchText, selectedValues });
      }
      const activeCount = this.activeFilters.size;
      pubSub.publish('app-show-notification', {
        type: 'info',
        message: `Filtro(s) activo(s): ${activeCount}${activeCount > 0 ? ' | ' + Array.from(this.activeFilters.keys()).join(', ') : ''}`,
      });
      this.invalidateSort();
      this.setState({ currentPage: 1, activeFiltersCount: activeCount }, false);
      this.rebuildRows();
      this.patchStatus();
      this.patchToolbar();
    }

    // ─── Template builders ────────────────────────────────────────

    buildStatusHtml() {
      const data = this.state.data;
      const filtered = this.getFilteredData();
      const totalRows = filtered.length;
      const selected = this.state.selected;
      const currentPage = this.state.currentPage;
      const totalPages = this.getTotalPages();
      const filterInfo = this.activeFilters.size > 0 ? ` (${filtered.length}/${data.length} filtrados)` : '';
      return `${totalRows} elemento/s${filterInfo}${selected.size ? ` (${selected.size} seleccionado/s)` : ''}<br>Página ${currentPage}/${totalPages}`;
    }

    buildHeaderHtml() {
      const columns = this.state.columns;
      const sortColumn = this.state.sortColumn;
      const sortDirection = this.state.sortDirection;

      return this.visibleColumns
        .map((col, i) => {
          const index = columns.findIndex(c => c.key === col.key);
          const shouldShowFilterButton = col.options?.shouldShowFilterButton !== false;
          const sortMarker = sortColumn === col.key && sortDirection
            ? `<i data-icon="${sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'}" class="size-3 shrink-0 ml-1"></i>`
            : '';
          const sortableClass = col.sorter ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700' : '';
          const style = col.width ? `width: ${col.width}px;` : '';
          return `
            <th on-click="toggleSort:${col.key}"
              style="${style}"
              class="relative px-2 py-0 text-left text-sm font-semibold border-l border-b ${sortableClass} ${col.className || ''}">
              <div class="flex items-center">
                <span class="flex-1 text-left">${col.title}</span>${sortMarker}
                ${shouldShowFilterButton ? `
                  <span
                    data-component="column-filter-button-component"
                    (filter-changed)="handleFilterChanged"
                    (column)="state.columns[${index}]"
                    (data)="state.data"
                    (filter)="activeFilters[${col.key}]"
                  ></span>
                ` : ''}
                ${(this.state.resizeColumns === false || i === this.visibleColumns.length - 1) ? '' : `
                  <div
                    class="absolute top-0 right-0 w-1 cursor-col-resize
                    hover:bg-blue-500/20 hover:border-r-2
                    hover:border-blue-600/20 transition-colors z-10"
                    data-resizer="true"
                    style="height: 10000px;">
                  </div>
                `}
              </div>
            </th>
          `;
        })
        .join('');
    }

    handleMousedown(_el, e) {
      const target = e.target;
      if (target.dataset && target.dataset.resizer) {
        e.stopPropagation();
        e.preventDefault();
        target.classList.add('bg-blue-500/20', 'border-r-2', 'border-blue-600/20');
        this.isResizing = true;
        this.currentResizer = target;
        let th = target.closest('th');
        const nextTh = th?.nextElementSibling;
        this.invertResize = !!(nextTh && !nextTh.nextElementSibling);
        if (this.invertResize) th = nextTh;
        this.currentTh = th;
        this.startX = e.pageX;
        this.startWidth = this.currentTh?.offsetWidth || 0;
        document.body.classList.add('select-none', 'cursor-col-resize');
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
      }
    }

    computeColumnsWidths() {
      if (!this.element) return;
      const cols = $('thead th.relative', this.element).all();
      const visible = this.visibleColumns;
      const widths = cols.map((col, i) => ({ key: visible[i]?.key, width: col.offsetWidth })).filter(w => w.key);
      this.saveColumnsWidths(widths);
      const widthMap = new Map(widths.map(w => [w.key, w.width]));
      this.setState({
        columns: this.state.columns.map(col =>
          widthMap.has(col.key) ? { ...col, width: widthMap.get(col.key) } : col
        ),
      }, false);
    }

    get visibleColumns() {
      if (!this.state.columns || !this.state.visibleColumns) return [];
      const columns = this.state.columns;
      const visibleColumnIds = this.state.visibleColumns;
      return columns.filter(c => visibleColumnIds.has(c.key));
    }

    buildBodyHtml() {
      const rows = this.getPageRows();
      const data = this.getSortedData();
      const selected = this.state.selected;
      if (!rows.length) {
        return `<tr><td colspan="999" class="px-3 py-8 text-center text-slate-500">Sin registros</td></tr>`;
      }

      const sortColumn = this.state.sortColumn;
      const sortDirection = this.state.sortDirection;
      const columns = this.state.columns;
      const groupColumn = sortColumn && sortDirection ? columns.find(c => c.key === sortColumn && c.grouping) : null;
      const colSpan = this.visibleColumns.length + 1;

      const groupRowsMap = new Map();
      if (groupColumn?.grouping) {
        for (const item of data) {
          const val = this.resolveCellValue(groupColumn, item);
          const key = groupColumn.grouping.getGroupKey?.(val, groupColumn, rows, data) || String(val);
          const arr = groupRowsMap.get(key);
          if (arr) arr.push(item);
          else groupRowsMap.set(key, [item]);
        }
      }

      let lastGroupKey = null;
      let rowIndex = 0;

      return rows.map(row => {
        let groupRow = '';
        if (groupColumn?.grouping) {
          const value = this.resolveCellValue(groupColumn, row);
          const key = groupColumn.grouping.getGroupKey?.(value, groupColumn, rows, data) || String(value);
          if (key !== lastGroupKey) {
            rowIndex = -1;
            lastGroupKey = key;
            let text = key;
            let className = DEFAULT_GROUP_CLASS;
            if (groupColumn.grouping.getGroupCaption) {
              const caption = groupColumn.grouping.getGroupCaption(value, groupColumn, rows, data, groupRowsMap.get(key) || []);
              if (typeof caption === 'string') {
                text = caption;
              } else if (caption && typeof caption === 'object' && 'text' in caption) {
                text = caption.text;
                className = caption.className || '';
              }
            }
            groupRow = `
              <tr>
                <td colspan="${colSpan}" class="${className}">
                  <div class="flex items-center gap-2">
                    <button class="app-button btn-ghost p-1! shrink-0" on-click="handleGroupClick:${key}">
                       <i data-icon="plus" class="size-3 hidden"></i>
                       <i data-icon="minus" class="size-3"></i>
                    </button>
                    <div class="flex-1">${text}</div>
                  </td>
                </tr>`;
          }
        }

        const isSelected = selected.has(row.id);
        const cells = this.visibleColumns
          .map(col => {
            const cell = col.cellRender
              ? col.cellRender(row, col)
              : String(this.resolveCellValue(col, row) ?? '');
            return `<td class="px-3 py-2 text-sm border-b ${col.className || ''}">${cell}</td>`;
          })
          .join('');
        const even = (rowIndex++) % 2 === 0;
        const rowClass = even ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'bg-white dark:bg-transparent';
        return `${groupRow}
          <tr
            id="row-${row.id}"
            on-click="handleRowClick:${row.id}"
            data-row
            data-group="${lastGroupKey || ''}"
            class="${isSelected ? 'bg-blue-50! dark:bg-blue-900/20!' : rowClass}
                hover:bg-slate-100 dark:hover:bg-slate-800">
            ${this.state.hideRowSelection ? '<td class="px-3 py-2 border-b border-r w-8"></td>' : `
              <td class="px-3 py-2 border-b w-10 max-w-10 min-w-10">
                <input type="checkbox" on-change="toggleRow:${row.id}" class="cursor-pointer" ${isSelected ? 'checked' : ''} />
              </td>`}
            ${cells}
          </tr>
        `;
      }).join('');
    }

    buildTemplate() {
      return `
        <div class="space-y-2" app-table>

          <!-- Toolbar -->
          <div
            data-table-toolbar
            data-bind="hide:state.hideToolbar"
            class="w-full overflow-x-auto">
            <div class="flex items-center gap-1 w-full min-w-max px-1 py-1 rounded border bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
              <!-- Status -->
              @if(!state.hideStatusbar)
                <span
                  data-table-status
                  data-bind="hide:state.hideStatusbar"
                  class="hidden md:block flex-1 text-sm text-slate-600 dark:text-slate-400 px-2 whitespace-nowrap text-left">
                </span>
              @endif
              <!-- Buttons -->
              @if(!state.hideButtons)
                <div
                  data-table-buttons
                  data-bind="hide:state.hideButtons"
                  class="flex items-center gap-1 ml-auto">
                  <button data-bind="hide:state.hideCrudButtons" data-crud data-btn="refresh" on-click="refreshData" class="app-button btn-ghost p-2! shrink-0" title="Refrescar">
                    <i data-icon="refresh-ccw" class="size-4"></i>
                  </button>
                  <button data-bind="hide:state.hideCrudButtons" data-crud data-btn="create" on-click="createRow" class="app-button btn-ghost p-2! shrink-0" title="Nuevo">
                    <i data-icon="plus" class="size-4"></i>
                  </button>
                  <button disabled data-bind="hide:state.hideCrudButtons" data-crud data-btn="delete" on-click="deleteRows" class="app-button btn-ghost p-2! shrink-0" title="Eliminar">
                    <i data-icon="trash-2" class="size-4"></i>
                  </button>
                  <button disabled data-bind="hide:state.hideCrudButtons" data-crud data-btn="edit" on-click="editRow" class="app-button btn-ghost p-2! shrink-0" title="Editar">
                    <i data-icon="edit" class="size-4"></i>
                  </button>
                  <div data-bind="hide:state.hideCrudButtons" data-crud class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0"></div>
                  <div class="contents" data-each="action in state.actions">
                    @if(action.show === 'button' || action.show === 'both')
                      <button disabled data-custom data-btn="{action.key}" on-click="handleAction:@action.key" class="app-button btn-ghost p-2! shrink-0" title="{action.label}">
                        @if(action.icon)<i data-icon="{action.icon}" class="size-4 shrink-0"></i>@endif
                        @if(!action.icon){action.label}@endif
                      </button>
                    @endif
                  </div>
                  @if(state.actions.length > 0)
                    <div data-custom class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0"></div>
                  @endif
                  <button disabled data-bind="hide:state.hidePagination" data-pagination data-btn="first" on-click="firstPage" class="app-button btn-ghost p-2! shrink-0"><i data-icon="chevrons-left" class="size-4"></i></button>
                  <button disabled data-bind="hide:state.hidePagination" data-pagination data-btn="prev" on-click="prevPage" class="app-button btn-ghost p-2! shrink-0"><i data-icon="chevron-left" class="size-4"></i></button>
                  <input data-bind="hide:state.hidePagination" data-pagination data-page-input value="1" on-change="goToPage" class="w-10 h-8 text-center text-sm border rounded dark:bg-slate-700 dark:border-slate-600"/>
                  <button disabled data-bind="hide:state.hidePagination" data-pagination data-btn="next" on-click="nextPage" class="app-button btn-ghost p-2! shrink-0"><i data-icon="chevron-right" class="size-4"></i></button>
                  <button disabled data-bind="hide:state.hidePagination" data-pagination data-btn="last" on-click="lastPage" class="app-button btn-ghost p-2! shrink-0"><i data-icon="chevrons-right" class="size-4"></i></button>
                </div>
              @endif

              <div data-bind="hide:state.hideMenuButton" class="js-menu w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0"></div>
              <div
                data-component="popover-trigger-component"
                data-placement="top-end"
                (click-inside)="clickInside"
                (before-open)="onOpenMenu"
                class="mb-1 js-menu">
                <button data-bind="hide:state.hideMenuButton" data-popover-trigger class="app-button px-2! btn-ghost shrink-0" title="Más opciones">
                  <i data-icon="menu" class="size-4"></i>
                </button>
                <div data-popover-content class="max-w-xs">
                  @if(state.actions.length > 0)
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-1 pb-0.5">Acciones</p>
                  @endif
                  <div class="px-1 contents" data-each="action in state.actions">
                    @if(action.show === 'menu' || action.show === 'both')
                      <button disabled data-btn="{action.key}" on-click="handleAction:@action.key"
                        class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded">
                        @if(action.icon)<i data-icon="{action.icon}" class="size-4 shrink-0"></i>@endif
                        <span>{action.label}</span>
                      </button>
                    @endif
                  </div>
                  @if(!state.hideMenuSelection)
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-1 pb-0.5">Selección</p>
                    <div class="px-1">
                      <button disabled data-btn="select-all" on-click="handleAction:select-all" class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded"><i data-icon="check-square" class="size-4 shrink-0"></i><span>Seleccionar todos</span></button>
                      <button disabled data-btn="clear-all" on-click="handleAction:clear-all" class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded"><i data-icon="square" class="size-4 shrink-0"></i><span>Limpiar selección</span></button>
                      <button disabled data-btn="invert-selection" on-click="handleAction:invert-selection" class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded"><i data-icon="shuffle" class="size-4 shrink-0"></i><span>Invertir selección</span></button>
                      <button disabled data-btn="show-only-selected" on-click="handleAction:show-only-selected" class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded"><i data-icon="filter" class="size-4 shrink-0"></i><span>Mostrar solo seleccionados</span></button>
                    </div>
                    <div data-bind="hide:state.hideMenuSelection" class="border-t my-1 dark:border-slate-700"></div>
                  @endif
                  @if(!state.hideMenuColumns)
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-1 pb-0.5">Columnas</p>
                    <div data-bind="fn:renderColumnList" class="p-1 border rounded-lg h-30 overflow-auto"></div>
                  @endif
                  @if(!state.hideMenuPagination)
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-1 pb-0.5 dark:border-slate-700 border-b">Paginación</p>
                    <div data-each="size in [5, 10, 25, 50, 100]" class="mt-1 flex w-full gap-2">
                      <button data-btn="page-size-{size}"
                        class="flex-1 app-button btn-ghost px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded @if(state.pageSize === size) bg-slate-200 dark:bg-slate-600/50 @endif"
                        on-click="handlePageSize:{size}">{size}</button>
                    </div>
                  @endif
                </div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto overflow-y-clip border rounded-lg dark:border-slate-700">
            <table on-mousedown="handleMousedown" class="w-full border-collapse text-sm">
              <thead class="bg-slate-100 dark:bg-slate-900">
                <tr>
                  <th class="px-3 py-2 border-b border-r w-10">
                    <input type="checkbox" on-change="selectAll" class="cursor-pointer"/>
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ─── Data utilities ───────────────────────────────────────────

    getFilteredData() {
      const data = this.state.data;
      if (this.activeFilters.size === 0) return data;
      const columns = this.state.columns;
      return data.filter(row => {
        for (const [columnKey, criteria] of this.activeFilters) {
          const column = columns.find(c => c.key === columnKey);
          if (!column) continue;
          const cellValue = this.resolveCellValue(column, row);
          const cellString = String(cellValue ?? '').toLowerCase();
          if (criteria.searchText.length > 0 && !cellString.includes(criteria.searchText.toLowerCase())) return false;
          if (criteria.selectedValues.size > 0 && !criteria.selectedValues.has(String(cellValue))) return false;
        }
        return true;
      });
    }

    getSortedData() {
      if (!this.sortDirty) return this.sortedData;
      const columns = this.state.columns;
      const rows = [...this.getFilteredData()];
      const sortColumn = this.state.sortColumn;
      const sortDirection = this.state.sortDirection;
      if (!sortColumn || !sortDirection) { this.sortedData = rows; this.sortDirty = false; return this.sortedData; }
      const column = columns.find(c => c.key === sortColumn);
      if (!column?.sorter && !column?.resolver) { this.sortedData = rows; this.sortDirty = false; return this.sortedData; }
      this.sortedData = rows.sort((a, b) => {
        let result = 0;
        if (typeof column.sorter === 'function') {
          result = column.sorter(a, b);
        } else {
          const va = this.resolveCellValue(column, a);
          const vb = this.resolveCellValue(column, b);
          if (va == null && vb == null) result = 0;
          else if (va == null) result = -1;
          else if (vb == null) result = 1;
          else if (typeof va === 'string' && typeof vb === 'string') result = accentNumericComparer(va, vb);
          else result = va < vb ? -1 : va > vb ? 1 : 0;
        }
        return sortDirection === 'asc' ? result : -result;
      });
      this.sortDirty = false;
      return this.sortedData;
    }

    getTotalPages() {
      return Math.max(1, Math.ceil(this.getSortedData().length / this.state.pageSize));
    }

    getPageRows() {
      const sorted = this.getSortedData();
      const page = this.state.currentPage;
      const size = this.state.pageSize;
      return sorted.slice((page - 1) * size, page * size);
    }

    resolveCellValue(column, item) {
      if (column.accessor && typeof column.accessor === 'function') return column.accessor(item);
      if (column.accessor && typeof column.accessor === 'string') return item[column.accessor];
      if (column.resolver) return column.resolver.resolve(item, column);
      return item[column.key];
    }

    loadPageSize() {
      if (this.props.pageSize === 'none') return Number.POSITIVE_INFINITY;
      const saved = storage.readValue(this.pageSizeStorageKey(), 10);
      return Number.isFinite(saved) ? saved : 10;
    }

    savePageSize() { storage.writeValue(this.pageSizeStorageKey(), Number(this.state.pageSize)); }
    saveVisibleColumns() { storage.writeValue(this.visibleColumnsStorageKey(), Array.from(this.state.visibleColumns)); }
    saveColumnsWidths(widths) { storage.writeValue(this.columnsWidthsStorageKey(), widths); }

    pageSizeStorageKey() { return `app-table-${this.tableKey}-page-size`; }
    visibleColumnsStorageKey() { return `app-table-${this.tableKey}-visible-columns`; }
    columnsWidthsStorageKey() { return `app-table-${this.tableKey}-columns-whidths`; }

    invalidateSort() { this.sortDirty = true; }
  }

  // Expose grouping helpers for consumer use
  // @ts-ignore
  VanillaReactive.TableHelpers = {
    TABLE_ACTIONS,
    DEFAULT_GROUP_CLASS,
    numericRangeGrouping,
    textInitialGrouping,
    valueGrouping,
    dateRangeGrouping,
  };

  registerComponent('column-filter-button-component', ColumnFilterButtonComponent);
  registerComponent('table-component', TableComponent);

}());
