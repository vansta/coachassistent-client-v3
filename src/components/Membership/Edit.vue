<template>
    <v-row>
        <v-col>
            <v-select v-model="modelValue.userId" :readonly="readonly" label="User" :items="users"></v-select>
        </v-col>
        <v-col>
            <v-select v-model="modelValue.roleId" :readonly="readonly" label="Role" :items="roles"></v-select>
        </v-col>
        <v-col cols="1">
            <v-btn v-if="!readonly" icon="mdi-delete" color="negative" flat round @click="$emit('delete')"></v-btn>
        </v-col>
    </v-row>
</template>

<script>
export default {
    setup() {
        
    },
    props: {
        modelValue: Object,
        roles: Array,
        users: Array,
        readonly: Boolean
    }
}
</script>