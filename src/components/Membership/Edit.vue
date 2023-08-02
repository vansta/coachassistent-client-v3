<template>
    <v-row>
        <v-col>
            <v-select v-model="modelValue.userId" label="User" :items="users"></v-select>
        </v-col>
        <v-col>
            <v-select v-model="modelValue.roleId" label="Role" :items="roles"></v-select>
        </v-col>
        <v-col cols="1">
            <v-btn icon="mdi-delete" color="negative" flat round @click="$emit('remove')"></v-btn>
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
        users: Array
    }
}
</script>