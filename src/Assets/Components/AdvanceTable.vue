<script setup lang="ts">
import {
    computed,
    provide, ref,
} from 'vue';
import TableService, {FilterDisplayType} from "../Services/tableService.js";
import {DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent} from "primevue/datatable";
import {usePrimeVue} from "primevue/config";

const props = withDefaults(defineProps<{
    service?: TableService<any>,
    propName?: string,
    filterDisplay?: FilterDisplayType,
}>(), {
    service: undefined,
    propName: undefined,
    filterDisplay: 'menu',
})

const selection = defineModel('selection');

const service = computed(() => props.service ? props.service : TableService.create<{id:number}>(props.filterDisplay).loadByPropName(props.propName ?? ''));

provide('service', service.value)

</script>


<template>
    <DataTable
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
            <slot name="header" v-bind:globalFilterValue="service.globalFilterValue" v-bind:globalFilterUpdated="service.globalFilterUpdated"></slot>
        </template>

        <template #empty>
            <slot name="empty"></slot>
        </template>

        <template #loading>
            <slot name="loading"></slot>
        </template>

        <slot />

    </DataTable>
</template>
