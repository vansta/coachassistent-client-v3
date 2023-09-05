<template>
    <v-card class="draggable d-flex justify-space-between align-center">
            <v-icon color="grey">mdi-drag-vertical</v-icon>
            <span class="flex-grow-1 font-weight-bold">{{ element.name }}</span>
            
            <v-btn icon variant="text" @click="element.dialog = !element.dialog" size="small" color="gray">
                <v-icon>mdi-eye</v-icon>
            </v-btn>

        <v-dialog v-model="element.dialog">
            <slot name="dialog"></slot>
        </v-dialog>
    </v-card>
</template>

<script setup>

const props = defineProps({
    element: {
        required: true,
        type: Object
    },
    tags: Array
});
</script>

<style scoped>
.draggable {
    cursor: grab;
}
</style>
