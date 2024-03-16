<script setup lang="ts">

import TableColumnFilter from "./TableColumnFilter.vue";
import {computed, inject} from "vue";
import TableService from "../Services/tableService";
import {data} from "autoprefixer";

const props = defineProps<{

    field?: string,
    selectionMode?: 'single' | 'multiple' | undefined,
}>()

const service = inject('service') as TableService<any>

const filterExist = computed(() => service.filterForFieldExist(props.field || ''))

const dataType = computed(() => filterExist.value && props.field ? service.getFilterByName(props.field || '').columnDataType : '')

const isSortable = computed(() => filterExist.value && props.field ? service.getFilterByName(props.field || '').sortable : false)

</script>

<template>
    <Column
        :filter-field="field"
        :field="field"
        :sort-field="field"
        :selection-mode="selectionMode"
        :data-type="dataType"
        :sortable="isSortable"
    >
        <!-- Header -->
        <template #header="data">
            <slot name="header" v-bind="data" />
        </template>


        <!-- Body -->
        <template #body="data">
            <slot name="body" v-bind="data" />
        </template>


        <!-- Filters -->
        <template v-if="filterExist" #filter="{ filterModel, field }">
            <TableColumnFilter
                :filter-model="filterModel"
                :filter-data="service.getFilterByName(field)"
            />
        </template>

    </Column>
</template>
