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


<template>
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
    >

        <template #header>
            <slot name="header"
                  v-bind:globalFilterValue="service.globalFilterValue.value"
                  v-bind:globalFilterUpdated="service.globalFilterUpdated" />
        </template>

        <template #empty>
            <slot name="empty"></slot>
        </template>

        <template #loading>
            <slot name="loading"></slot>
        </template>

        <slot />

    </OwnDataTable>
</template>
