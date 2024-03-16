<script setup lang="ts">

import {TableComponentType, tableComponentTypeEqualsTo} from "../Enums/TableComponentType";
import {ColumnFilterModelType} from "primevue/column";
import {FilterableColumn} from "../Services/tableService";

const props = defineProps<{
    filterModel: ColumnFilterModelType,
    filterData: FilterableColumn,
}>();


</script>

<template>

    <Calendar
        v-if="tableComponentTypeEqualsTo(TableComponentType.CALENDAR, filterData.tableComponentType)"
        v-model="filterModel.value"
        :dateFormat="filterData.dateFormat"
        :placeholder="filterData.placeholder"
        :mask="filterData.mask"
    />
    <InputText
        v-else
        v-model="filterModel.value"
        type="text"
        class="p-column-filter"
        :placeholder="filterData.placeholder || ''"
    />

</template>
