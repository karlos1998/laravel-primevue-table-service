<script setup lang="ts">
import {inject, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, provide, reactive, Ref, ref, useSlots} from 'vue';
import TableService from "../Services/tableService.js";
import {DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent} from "primevue/datatable";

const { service } = defineProps<{
    service: TableService<any>,
}>()

const selection = defineModel('selection');

provide('service', service)

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
        filterDisplay="menu"
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
            <slot name="header"></slot>
        </template>

        <slot />

    </DataTable>
</template>
