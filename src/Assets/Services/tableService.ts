import {router, usePage} from "@inertiajs/vue3";
import {ref, toRaw, watch} from "vue";
import {TableComponentType} from "../Enums/TableComponentType";
import {ColumnDataType} from "../Enums/ColumnDataType";
import {
    DataTableFilterEvent,
    DataTableFilterMeta,
    DataTableOperatorFilterMetaData,
    DataTablePageEvent, DataTableSortEvent
} from "primevue/datatable";
import { PageState } from 'primevue/paginator';
import axios from 'axios';

// import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
export interface AdvanceTableResponse<T> {
    data: T[];
    meta: ResponseMeta,
    tableData: TableData,
}

export interface ResponseMeta {
    current_page: number,
    from: number,
    last_page: number,
    path: string,
    per_page: number,
    to: number,
    total: number,

}

export interface FilterableColumn {

    columnDataType: ColumnDataType,
    tableComponentType: TableComponentType,

    placeholder?: string,

    dateFormat?: string,
    mask?: string,

    sortable: boolean,

    options: Array<{
        label: string,
    }>,

}

export interface TableData {
    columns: {
        [key: string]: FilterableColumn,
    },
    activeFilters: DataTableFilterMeta,
    rowsPerPage: number[],
    propName: string,
    sortOrder: 'ASC' | 'DESC',
    sortField: string,
    globalFilter: string,
}

export interface SortData {
    field: string;
    order: 'ASC' | 'DESC'
}

export type FilterDisplayType = 'row' | 'menu';

export class TableService<DataType> {

    propName: string;

    rows = 0;

    loading = ref(false);

    data: DataType[] = []

    meta: ResponseMeta = {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: "",
        per_page: 0,
        to: 0,
        total: 0,

    };

    tableData: TableData = {
        columns:{},
        activeFilters: {},
        rowsPerPage: [100],
        propName: 'defualt',
        sortOrder: 'ASC',
        sortField: 'id',
        globalFilter: '',
    };

    globalFilterValue = ref('')

    tableModelFilters: DataTableFilterMeta = {}

    //todo = matchMode: 'startsWith' | 'contains' | 'notContains' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | 'between' | 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter' | string | undefined;

    // perPage: number = 1;

    // filters: DataTableFilterMeta = {};

    sort: SortData = {
        field: 'id',
        order: 'ASC',
    }

    globalFilter: string = ''

    filterDisplay: FilterDisplayType = 'menu';

    globalFilterDebounceTime: number;

    constructor(filterDisplay: FilterDisplayType, globalFilterDebounceTime:number = 500) {
        this.propName = '';
        this.filterDisplay = filterDisplay;
        this.globalFilterDebounceTime = globalFilterDebounceTime;

        console.log('globalFilterDebounceTime', globalFilterDebounceTime)

        this.globalFilterUpdatedDebounce = debounce( (data: string) => {
            this.globalFilter = data;
            this.reload();
        }, this.globalFilterDebounceTime)
    }

    /**
     * Utworzenie instancji
     * @returns {TableService}
     */
    static create = <DataType>(filterDisplay: FilterDisplayType = 'menu', globalFilterDebounceTime: number = 500): TableService<DataType> => new this<DataType>(filterDisplay, globalFilterDebounceTime)


    /************ Metoda 1 **********************/

    /**
     * Podaj nazwe propsa ktory ma byc aktualizowany podczas przeladowywania danych na stronie
     * @param propName
     * @returns {TableService}
     */
    setPropName(propName: string): this {
        this.propName = propName;
        return this;
    }

    /**
     * Wczytaj dane z propsa - paginowane dane z data i meta
     * @param response
     * @returns {TableService}
     */
    loadData (response: AdvanceTableResponse<DataType>): this {
        if(!response?.data) throw new Error('LoadData: Brak data w response.');
        if(!response?.meta) throw new Error('LoadData: Brak meta w response.');

        this.rows = response.data.length;
        this.meta = response.meta;

        if(response.tableData) {
            this.tableData = response.tableData
            this.defineFilters(this.tableData.columns, this.tableData.activeFilters)
            this.loadSort(this.tableData);

            // Only update the globalFilterValue if there's no active filter or if it's the initial load
            if (!this.globalFilter || this.globalFilterValue.value === '') {
                this.globalFilterValue.value = response.tableData.globalFilter;
            }
        }

        this.data = response.data

        this.loading.value = false;

        return this;
    }


    /************ Metoda 2 (skrocona :D) **********************/

    loadByPropName(propName: string) {
        const data =  structuredClone(toRaw(usePage().props[propName])) as AdvanceTableResponse<DataType>;
        // watch(usePage(), (newUsePage) => {
        //     console.log(usePage(), 'usePage()')
        //     if(newUsePage.props[propName]) {
        //         this.loadData(newUsePage.props[propName] as Response<DataType>)
        //     }
        // })
        return this
            .setPropName(propName)
            .loadData(data);
    }




    /**
     * Fuknkcja do pidpięcia pod emit z tabeli od zmiany strony
     * @param data
     */
    changePage(data: DataTablePageEvent|PageState) {
        this.meta.current_page = data.page + 1;
        this.meta.per_page = data.rows;

        // console.log('changePage', data)
        // console.log('filters in changePage', this.tableData.activeFilters)

        this.reload();
    }

    private reload() {
        this.loading.value = true;

        // If we're using global filter, use Axios to prevent page reload
        if (this.globalFilter) {
            // Create params object for both URL update and axios request
            const params = {
                tables: {
                    [this.tableData.propName]: {
                        page: this.meta.current_page,
                        perPage: this.meta.per_page,
                        globalFilter: this.globalFilter,
                        filters: JSON.stringify(this.tableData.activeFilters),
                        sortOrder: this.sort.order,
                        sortField: this.sort.field,
                    }
                }
            };

            // Update URL with the global filter value without causing a page reload
            this.updateUrlWithParams(params);

            // Get the current URL including query parameters
            const url = window.location.pathname + window.location.search;

            // Get the current URL to extract the X-Inertia-Version from the document
            const inertiaVersion = document.querySelector('div[data-page]')?.getAttribute('data-page') ?
                JSON.parse(document.querySelector('div[data-page]')?.getAttribute('data-page') || '{}').version : '';

            /**
             * Rozwiązanie axios powstało wyłącznie z powodu odświeżania danych podczas ciągłego pisania w global filter ;x
             */

            axios.get(url, {
                params,
                headers: {
                    'X-Inertia': 'true',
                    'X-Inertia-Partial-Component': usePage().component,
                    // 'X-Inertia-Partial-Component': usePage().component.value.split('::')[0],
                    'X-Inertia-Partial-Data': this.propName,
                    'X-Inertia-Version': inertiaVersion,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/html, application/xhtml+xml',
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (response.data && response.data.props && response.data.props[this.propName]) {
                    this.loadData(response.data.props[this.propName] as AdvanceTableResponse<DataType>);
                }
            })
            .catch(error => {
                console.warn('Axios request failed --> ', error);
                this.loading.value = false;
            });
        } else {
            // For non-global filter operations, use the original router.reload
            try {
                // Create params object for both URL update and router reload
                const params = {
                    tables: {
                        [this.tableData.propName]: {
                            page: this.meta.current_page,
                            perPage: this.meta.per_page,
                            globalFilter: this.globalFilter ?? undefined,
                            filters: JSON.stringify(this.tableData.activeFilters),
                            sortOrder: this.sort.order,
                            sortField: this.sort.field,
                        }
                    }
                };

                // Update URL with the parameters without causing a page reload
                this.updateUrlWithParams(params);

                router.reload({
                    only: [this.propName],
                    data: params,
                    onSuccess: () => {
                        this.loading.value = false
                    }
                })
            } catch (e) {
                console.warn('router reload fail --> ', e)
            }
        }
    }

    /**
     * Podpiąć do tabelki - zaznacza odpowiednią stronę w paginacji podczas wczytania na nowo strony
     * @param additional
     * @returns {{root: root}}
     */
    public ptAttributes = (additional = {}) => ({
        root: (event: any) => {
            event.state.d_first = ( this.meta.current_page - 1 ) * this.meta.per_page;
            event.state.d_rows = this.meta.per_page;
            event.state.d_sortField = this.sort.field;
            event.state.d_sortOrder = this.sort.order == 'ASC' ? 1 : -1;
        },
        ...additional,
    })

    // public ptAttributes = (additional = {}) => {
    //     console.log('additional', additional)
    //     return {
    //         root: (event: any) => {
    //             console.log('event', event);
    //             event.state.d_first = ( this.meta.current_page - 1 ) * this.meta.per_page;
    //             event.state.d_rows = this.meta.per_page;
    //         },
    //     ...additional,
    //     }
    // }

    /**
     * Pokazuje status true/false czy trwa wczytywanie danych
     * @returns {UnwrapRef<boolean>}
     */
    public duringLoading = () => this.loading.value


    public filter(data : DataTableFilterEvent) {
        // console.log('filter -> ', data.filters)

        this.tableData.activeFilters = data.filters;
        // this.tableData.activeFilters = { ...data.filters };
        this.reload();
    }

    public getFilterByName = (filedName: string): FilterableColumn => this.tableData.columns[filedName]

    public filterForFieldExist = (filedName: string): boolean => filedName in this.tableData.columns;

    private defineFilters(dataFilters: any, activeFilters: DataTableFilterMeta) {

        this.tableModelFilters = {
            // global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            // contact: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            // text: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }, { value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            // date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        }

        for(const key in dataFilters) {
            if(key in activeFilters) {
                let value = activeFilters[key] as DataTableOperatorFilterMetaData; //TODO ! To znaczy ze obsluguje tylko multi wybieranie - pojedyncze trzeba tez pgarmac

                // console.log('test value', key, value)

                //todo - ogolnie ciezki temat ze trzba jakis standard formatowania tej daty ogarnac, a druga sprawa ze to jakos odpala niesokonczona petle :D
                // if(dataFilters[key].tableComponentType === TableComponentType.CALENDAR) {
                //     value.constraints = value.constraints.map((item) => ({
                //         ...item,
                //         value: format(item.value, 'y/M/d')
                //     }))
                // }

                this.tableModelFilters[key] = value;
                continue;
            }
            this.tableModelFilters[key] =  ((objectValue) => {
                switch(objectValue.tableComponentType) {

                    case TableComponentType.INPUT_TEXT:
                    default: return {
                        // operator: FilterOperator.AND,
                        operator: 'and',
                        constraints: [{ value: null, matchMode: 'contains' }] }

                    case TableComponentType.CALENDAR: return { operator: 'and', constraints: [{ value: null, matchMode: 'dateIs' }] }
                }
            })(dataFilters[key])
        }

        // console.log('this.tableModelFilters', this.tableModelFilters)

    }

    public getRowsPerPageOptions = (): number[] => this.tableData.rowsPerPage;

    public sortEvent = (data: DataTableSortEvent) => {
        //todo : data.filters - exists :D
        this.sort = {
            field: data.sortField as string,
            order: (typeof data.sortOrder == 'number' && data.sortOrder > 0) ? 'ASC' : 'DESC'
        }
        this.reload();
    }

    private loadSort = (tableData: TableData) => {
        this.sort = {
            field: tableData.sortField,
            order: tableData.sortOrder,
        }
        // console.log('sort loaded', this.sort);
    }

    public globalFilterUpdatedDebounce:Function

    public globalFilterUpdated = (data: string) => {
        this.globalFilterValue.value = data;
        this.globalFilterUpdatedDebounce(data);
    }

    /**
     * Updates the URL with the provided parameters without causing a page reload
     * @param params The parameters to add to the URL
     */
    private updateUrlWithParams(params: any) {
        // Get the current URL and parse its query parameters
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;

        // Convert the params object to URL query parameters
        const flattenParams = (obj: any, prefix = '') => {
            return Object.keys(obj).reduce((acc: any, key) => {
                const pre = prefix.length ? `${prefix}[${key}]` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    Object.assign(acc, flattenParams(obj[key], pre));
                } else {
                    acc[pre] = obj[key];
                }
                return acc;
            }, {});
        };

        const flatParams = flattenParams(params);

        // Update or add each parameter to the URL
        Object.keys(flatParams).forEach(key => {
            if (flatParams[key] !== undefined && flatParams[key] !== null) {
                searchParams.set(key, flatParams[key]);
            }
        });

        // Preserve other query parameters that are not related to the table
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => {
            if (!key.startsWith('tables[')) {
                searchParams.set(key, value);
            }
        });

        // Update the URL without causing a page reload
        const newUrl = `${url.pathname}?${searchParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }

}

const debounce = (func: Function, timeout: number = 300) => {
    let timer = 0;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

export default TableService;
