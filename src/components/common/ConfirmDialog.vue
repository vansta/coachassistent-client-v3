<template>
    <v-dialog v-model="show" class="d-flex justify-center">
        <v-card max-width="500" class="mx-auto">
            <v-card-title class="text-orange">
                <v-icon start>mdi-alert</v-icon>
                Confirm
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                Are you sure you want to delete this item?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="emit('confirm', true)"><v-icon start>mdi-check</v-icon>Ok</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="emit('cancel', false)"><v-icon start>mdi-cancel</v-icon>Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { computed } from 'vue';
    const props = defineProps({
        isRevealed: Boolean
    })

    const emit = defineEmits([
        'confirm', 'cancel'
    ])

    const show = computed({
        get() { return props.isRevealed; },
        set() { emit('cancel') } 
    })
</script>