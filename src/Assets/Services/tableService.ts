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

    globalFilterValue: string = ''

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

    constructor(filterDisplay: FilterDisplayType) {
        this.propName = '';
        this.filterDisplay = filterDisplay;
    }

    /**
     * Utworzenie instancji
     * @returns {TableService}
     */
    static create = <DataType>(filterDisplay: FilterDisplayType = 'menu'): TableService<DataType> => new this<DataType>(filterDisplay)


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
            this.globalFilterValue = response.tableData.globalFilter;
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


        // router.get(window.location.pathname, {
        //     tables: {
        //         [ this.tableData.propName ]: {
        //             page: this.meta.current_page,
        //             perPage: this.meta.per_page,
        //             globalFilter: this.globalFilter ?? undefined,
        //             filters: JSON.stringify(this.tableData.activeFilters),
        //             sortOrder: this.sort.order,
        //             sortField: this.sort.field,
        //             // hasActiveFilters: Object.values(this.filters). //todo
        //         }
        //     }
        // }, {
        //     only: [ this.propName ]
        // })
        // return;

        try {
            router.reload({
                only: [this.propName],
                data: {
                    tables: {
                        [this.tableData.propName]: {
                            page: this.meta.current_page,
                            perPage: this.meta.per_page,
                            globalFilter: this.globalFilter ?? undefined,
                            filters: JSON.stringify(this.tableData.activeFilters),
                            sortOrder: this.sort.order,
                            sortField: this.sort.field,
                            // hasActiveFilters: Object.values(this.filters). //todo
                        }
                    }
                },
                onSuccess: () => {
                    this.loading.value = false
                }
            })
        } catch (e) {
            console.warn('router reload fail --> ', e)
        }
        // console.log('after reload log')
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

    public globalFilterUpdated = debounce( (data: string) => {
        this.globalFilter = data;
        this.reload();
    }, 500)

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
