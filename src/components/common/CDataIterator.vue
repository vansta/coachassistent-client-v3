<template>
    <v-container>
        <v-row>
            <v-col>
                <slot name="search"></slot>
            </v-col>
        </v-row>
        <v-row v-if="modelValue.loading">
            <v-col v-for="n in itemsPerRow" :key="`skeleton-${n}`">
                <v-skeleton-loader type="subtitle, chip, list-item-three-line, image"></v-skeleton-loader>
                <!-- <v-progress-linear indeterminate></v-progress-linear> -->
            </v-col>
        </v-row>
        <v-row v-else v-for="n in items.length" :key="'row' + n">
            <v-col v-for="(item, index) in itemsPerRowGroup(n - 1)" :key="'col' + index">
                <slot name="item" :item="item"></slot>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-pagination v-model="modelValue.currentPage" :length="length" rounded @update:modelValue="onPagination"></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    modelValue: Object,
    items: Array,
    cols: Number
});
const emit = defineEmits(['update:model-value']);
// const currentPage = ref(1);
// const pageInfo = ref({
//     currentPage: 1,
//     itemsPerPage: 6
// })

const itemsPerRowGroup = (rowIndex) => {
    if (props.items && props.items.length > 0){
        var fromIndex = rowIndex * itemsPerRow.value;
        var toIndex = fromIndex + itemsPerRow.value;
        return props.items.slice(fromIndex, toIndex);
    }
} 
const onPagination = () => {
    emit('update:model-value', props.modelValue)
}

const itemsPerRow = computed(() => 12 / props.cols);
const length = computed(() => Math.ceil(props.modelValue.totalCount / props.modelValue.itemsPerPage));
</script>