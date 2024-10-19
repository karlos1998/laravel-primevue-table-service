<script setup lang="ts">

import { ConversationTreeResource } from '@/Resources/ConversationTree.resource';
import { computed } from 'vue';
import TableService, { FilterDisplayType } from '@advance-table/Services/tableService';
import { DataTablePageEvent } from 'primevue/datatable';
import OwnDataTable from '@advance-table-primevue-dir/DataTable.vue';

const props = withDefaults(defineProps<{
    service?: TableService<any>,
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
        @page="(page: DataTablePageEvent) => service.changePage(page)"
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
