<template>
    <v-card height="800" width="500">
        <v-card-title>
            <slot name="name"><div class="text-h6 text-left text-capitalize">Name</div></slot>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <slot name="description">Description</slot>
        </v-card-text>
    </v-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Layout',
    props: {
    },
    setup() {
        return {
            
        }
    },
})
</script>

<style scoped>
    .my-card {
        width: 100%;
        height: 100%;
    }
</style>
