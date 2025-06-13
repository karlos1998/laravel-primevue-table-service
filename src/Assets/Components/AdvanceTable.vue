<script setup lang="ts">

import OwnDataTable from '@advance-table-primevue-dir/DataTable.vue';

import {
    computed,
    provide, ref,
} from 'vue';
import TableService, {FilterDisplayType} from "../Services/tableService.js";
import {DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent} from "primevue/datatable";

const props = withDefaults(defineProps<{
    service?: TableService<any>,
    propName?: string,
    filterDisplay?: FilterDisplayType,
    globalFilterDebounceTime: number
}>(), {
    propName: undefined,
    filterDisplay: 'menu',
    globalFilterDebounceTime: 500,
})

const selection = defineModel('selection');

const service = computed(() => props.service ? props.service : TableService.create<{id:number}>(props.filterDisplay, props.globalFilterDebounceTime).loadByPropName(props.propName ?? ''));

provide('service', service.value)

</script>

<style scoped>
/* Ensure the header has the same styling as the original DataTable header */
.p-datatable-header {
    padding: 1rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-bottom: 0;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
}

/* Remove top border radius from DataTable when using external header */
.no-header {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
}
</style>


<template>
    <div>
        <!-- Header section outside the DataTable to prevent it from being disabled during loading -->
        <div class="p-datatable-header">
            <slot name="header"
                  v-bind:globalFilterValue="service.globalFilterValue.value"
                  v-bind:globalFilterUpdated="service.globalFilterUpdated" />
        </div>

        <OwnDataTable
            ref="mailTable"
            :value="service.data"
            v-model:filters="service.tableModelFilters"
            v-model:selection="selection"
            :rows-per-page-options="service.getRowsPerPageOptions()"
            dataKey="id"
            rowHover
            :filterDisplay="filterDisplay"
            paginator
            lazy
            :rows="service.rows"
            :total-records="service.meta.total"
            @page="(page: DataTablePageEvent) => service.changePage(page)"
            :loading="service.duringLoading()"
            :pt="service.ptAttributes()"
            @filter="(data: DataTableFilterEvent) => service.filter(data)"
            @sort="(data: DataTableSortEvent) => service.sortEvent(data)"
            class="no-header"
        >
            <!-- No header template since we moved it outside -->

            <template #empty>
                <slot name="empty"></slot>
            </template>

            <template #loading>
                <slot name="loading">
                    <div class="flex justify-content-center align-items-center">
                        <div class="p-4">
                            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                            <div class="mt-2">Loading...</div>
                        </div>
                    </div>
                </slot>
            </template>

            <slot />

        </OwnDataTable>
    </div>
</template>
