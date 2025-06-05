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
const sliderUpdated = () => valueUpdated();

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
    <div v-else-if="tableComponentTypeEqualsTo(TableComponentType.SLIDER, filterData.tableComponentType)" class="p-column-filter">
        <Slider
            v-model="filterModel.value"
            range
            class="m-4"
            :min="filterData.min || 0"
            :max="filterData.max || 100"
            :step="filterData.step || 1"
            @change="sliderUpdated()"
        />
        <div class="flex items-center justify-between px-2">
            <span>{{ filterModel.value ? filterModel.value[0] : (filterData.min || 0) }}</span>
            <span>{{ filterModel.value ? filterModel.value[1] : (filterData.max || 100) }}</span>
        </div>
    </div>
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
