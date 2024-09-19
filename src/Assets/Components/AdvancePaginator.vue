<script setup lang="ts">
    import { computed } from 'vue';
    import TableService from '../Services/tableService';


    const props = withDefaults(defineProps<{
        service?: TableService<any>,
        propName?: string,
    }>(), {
        service: undefined,
        propName: undefined,
    })

    const service = computed(() => props.service ? props.service : TableService.create<{id:number}>().loadByPropName(props.propName ?? ''));

</script>

<template>

    <slot name="header" v-bind:globalFilterValue="service.globalFilterValue" v-bind:globalFilterUpdated="service.globalFilterUpdated"></slot>

    <slot name="body" v-bind="service.data" />

    <Paginator
        :rows="service.rows"
        :totalRecords="service.meta.total"
        :rowsPerPageOptions="service.tableData.rowsPerPage"
        @page="(page) => service.changePage(page)"
        :pt="service.ptAttributes()"
        class="mt-2"
    />
</template>

<style>

</style>
