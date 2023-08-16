<template>
    <v-dialog v-model="show" class="d-flex justify-center">
        <v-card max-width="500" min-width="400" class="mx-auto">
            <v-card-title class="text-orange">
                <v-icon start>mdi-alert</v-icon>
                {{ t('confirm') }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                {{ t('areyousure') }}
            </v-card-text>
            <v-card-actions>
                <v-btn @click="emit('confirm', true)"><v-icon start>mdi-check</v-icon>{{t('ok')}}</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="emit('cancel', false)"><v-icon start>mdi-cancel</v-icon>{{t('cancel')}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const { t } = useI18n();
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
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