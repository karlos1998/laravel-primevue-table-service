<script setup lang="ts">
interface DropdownOption {
    label: string,
    type: string,
    severity?: string,
}

defineProps<{
    option: DropdownOption,
}>();
</script>

<template>
    <Tag v-if="option.type == 'tag'" :value="option.label" :severity="option.severity" />
    <span v-else>{{option.label}}</span>
</template>
