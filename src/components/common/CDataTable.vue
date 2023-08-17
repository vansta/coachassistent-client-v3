<template>
    <v-table>
        <thead>
            <tr>
                <th v-for="(header, index) in headers" :key="index">
                    {{ t(header.header) }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in items" :key="index" @click="$emit('click:row', item)">
                <td v-for="(header, index) in headers" :key="index">
                    <span v-if="header.field === 'tags'">
                        <v-chip v-for="tag in item.tags" :key="tag">{{tag}}</v-chip>
                    </span>
                    <span v-else>
                        {{ item[header.field] }}
                    </span>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>
import { useI18n } from "vue-i18n"

const props = defineProps({
    headers: Array,
    items: Array
})

const { t } = useI18n();
</script>
