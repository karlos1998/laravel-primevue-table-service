<script setup lang="ts">

import TableColumnFilter from "./TableColumnFilter.vue";
import {computed, inject, onBeforeUnmount, onMounted, useSlots} from "vue";
import TableService from "../Services/tableService";
import {TableComponentType, tableComponentTypeEqualsTo} from "../Enums/TableComponentType";

const props = withDefaults(defineProps<{
    field?: string,
    header?: string,

    showFilterMatchMode?: boolean,
    showFilterOperator?: boolean,

    selectionMode?: 'single' | 'multiple' | undefined,
}>(), {
    showFilterMatchMode: true,
    showFilterOperator: true,
})

const service = inject('service') as TableService<any>

const filterExist = computed(() => service.filterForFieldExist(props.field || ''))

const dataType = computed(() => filterExist.value && props.field ? service.getFilterByName(props.field || '').columnDataType : '')

const isSortable = computed(() => filterExist.value && props.field ? service.getFilterByName(props.field || '').sortable : false)

const slots = useSlots();
const hasBodySlot = computed(() => !!slots.body);

const filterData = computed(() => filterExist.value ? service.getFilterByName(props.field ?? '') : undefined);


</script>

<template>
    <Column
        :filter-field="field"
        :field="field"
        :sort-field="field"
        :selection-mode="selectionMode"
        :data-type="dataType"
        :sortable="isSortable"
        :header="header"
        :show-filter-match-modes="filterData?.tableComponentType && !tableComponentTypeEqualsTo(TableComponentType.DROPDOWN, filterData.tableComponentType) && showFilterMatchMode && !tableComponentTypeEqualsTo(TableComponentType.SLIDER, filterData.tableComponentType)"
        :show-filter-operator="showFilterOperator && (filterData && !tableComponentTypeEqualsTo(TableComponentType.SLIDER, filterData.tableComponentType))"
    >
        <!-- Header -->
        <template #header="data">
            <slot name="header" v-bind="data" />
        </template>


        <!-- Body -->
        <template #body="data">
            <slot v-if="hasBodySlot" name="body" v-bind="data" />
            <template v-else>{{data.data[data.field]}}</template>
        </template>


        <!-- Filters -->
        <template v-if="filterExist" #filter="{ filterModel, filterCallback }">
            <TableColumnFilter
                v-if="filterData"
                :filter-model="filterModel"
                :filter-data="filterData"
                :filter-callback="filterCallback"
                :filter-display="service.filterDisplay"
            />
        </template>

    </Column>
</template>
