<template>
    <v-card min-width="350" max-height="500">
        <v-card-title>
            <slot name="name"><div class="text-h6 text-left text-capitalize">Name</div></slot>
        </v-card-title>
        <!-- <v-divider inset></q-separator> -->
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
<!-- 
<style lang="scss" scoped>
    .my-card {
        min-width: 400px;
    }
</style> -->
