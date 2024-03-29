<script setup lang="ts">

import {TableComponentType, tableComponentTypeEqualsTo} from "../Enums/TableComponentType";
import {ColumnFilterModelType} from "primevue/column";
import {FilterableColumn, FilterDisplayType} from "../Services/tableService";
import AdvanceColumnDropdownItem from "./AdvanceColumnDropdownItem.vue";
import {debounce} from "chart.js/helpers";

const props = defineProps<{
    filterModel: ColumnFilterModelType,
    filterData: FilterableColumn,
    filterCallback: Function,
    filterDisplay: FilterDisplayType,
}>();

const valueUpdated = () => {
    if(props.filterDisplay === 'row') {
        props.filterCallback();
    }
}
const dropdownUpdated = () => valueUpdated();
const calendarUpdated = () => valueUpdated();

const inputUpdated = debounce(valueUpdated, 1000);

</script>

<template>

    <Calendar
        v-if="tableComponentTypeEqualsTo(TableComponentType.CALENDAR, filterData.tableComponentType)"
        v-model="filterModel.value"
        :dateFormat="filterData.dateFormat"
        :placeholder="filterData.placeholder"
        :mask="filterData.mask"
        @change="calendarUpdated()"
    />
    <Dropdown
        v-else-if="tableComponentTypeEqualsTo(TableComponentType.DROPDOWN, filterData.tableComponentType)"
        :options="filterData.options"
        v-model="filterModel.value"
        :placeholder="filterData.placeholder"
        class="p-column-filter"
        style="min-width: 12rem"
        @change="dropdownUpdated()"
    >
        <template #option="{option}">
            <AdvanceColumnDropdownItem :option="option" />
        </template>
        <template #value="{value, placeholder}">
            <AdvanceColumnDropdownItem v-if="value" :option="value" />
            <template v-else>{{placeholder}}</template>
        </template>
    </Dropdown>
    <InputText
        v-else
        v-model="filterModel.value"
        type="text"
        class="p-column-filter"
        :placeholder="filterData.placeholder || ''"
        @input="inputUpdated()"
    />

</template>
