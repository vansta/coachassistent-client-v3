<template>
    <!-- <v-table>
        <thead>
            <tr>
                <th :colspan="itemsPerRow">
                    <slot name="header"></slot>
                </th>
            </tr>
            <tr>
                <th :colspan="itemsPerRow">
                    <slot name="search"></slot>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="loading">
                <td :colspan="itemsPerRow">
                    <v-progress-linear indeterminate></v-progress-linear>
                </td>
            </tr>
            <tr v-else v-for="n in 5" :key="'row' + n">
                <td v-for="(item, index) in itemsPerRowGroup(n - 1)" :key="'col' + index">
                    <slot name="item" :item="item"></slot>
                </td>
            </tr>
        </tbody>
    </v-table> -->
    <v-container>
        <v-row>
            <v-col>
                <slot name="header"></slot>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <slot name="search"></slot>
            </v-col>
        </v-row>

        <v-row v-for="n in items.length" :key="'row' + n">
            <v-col v-for="(item, index) in itemsPerRowGroup(n - 1)" :key="'col' + index">
                <slot name="item" :item="item"></slot>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-pagination v-model="currentPage" :length="totalCount / itemsPerRow" rounded></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    items: Array,
    cols: Number,
    loading: Boolean,
    totalCount: {
        type: Number,
        default: 0
    }
});
const currentPage = ref(1);

const itemsPerRowGroup = (rowIndex) => {
    if (props.items && props.items.length > 0){
        var fromIndex = rowIndex * itemsPerRow.value;
        var toIndex = fromIndex + itemsPerRow.value;
        return props.items.slice(fromIndex, toIndex);
    }
} 

const itemsPerRow = computed(() => 12 / props.cols);
const length = computed(() => props.totalCount / itemsPerRow.value)
</script>