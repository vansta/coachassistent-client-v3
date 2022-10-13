<template>
    <v-table>
        <thead>
            <tr>
                <th :colspan="itemsPerRow">
                    <slot name="header"></slot>
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
    </v-table>
</template>

<script>
export default {
    setup() {
        
    },
    props: {
        items: Array,
        cols: Number,
        loading: Boolean
    },
    methods: {
        itemsPerRowGroup (rowIndex) {
            if (this.items && this.items.length > 0){
                var fromIndex = rowIndex * this.itemsPerRow;
                var toIndex = fromIndex + this.itemsPerRow;
                return this.items.slice(fromIndex, toIndex);
            }
        }
    },
    computed: {
        itemsPerRow () {
            return 12 / this.cols
        },
        
    }
}
</script>