<script setup lang="ts">

import TableService from '@advance-table/Services/tableService';
import { DataViewPageEvent } from 'primevue/dataview';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    propName?: string,
}>(), {
    service: undefined,
    propName: undefined,
})

const service = computed(() => TableService.create<{id:number}>().loadByPropName(props.propName ?? ''));

</script>

<template>
    <DataView
        :value="service.data"
        data-key="id"
        @page="(page: DataViewPageEvent) => service.changePage(page)"
        paginator
        lazy
        :rows="service.rows"
        :total-records="service.meta.total"
        :pt="service.ptAttributes()"
    >
        <template #list="data">
            <slot name="list" v-bind="data" />
        </template>
    </DataView>
</template>
