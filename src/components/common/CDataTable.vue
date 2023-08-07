<template>
    <v-table>
        <thead></thead>
        <tbody>
            <tr v-for="(item, index) in items" :key="index" @click="$emit('click:row', item)">
                <td v-for="(header, index) in headers" :key="index">
                    {{ item[header.field] }}
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
        headers: Array,
        items: Array
    }
}
</script>
