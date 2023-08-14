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

<script setup>

</script>
