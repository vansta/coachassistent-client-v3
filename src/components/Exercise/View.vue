<template>
    <layout>
        <template #name>
            <div class="d-flex">
                <div class="text-h6 text-left text-capitalize flex-grow-1">{{ exercise.name }}</div>
                <v-btn v-if="mode == 'edit'" :disabled="!authStore.isAuthenticated" icon="mdi-content-copy" variant="text" @click="onCopy">
                    <v-icon>mdi-content-copy</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.copy')"></v-tooltip>
                </v-btn>
                <v-btn :disabled="!(authStore.isAuthenticated && can('update', exercise))" icon="mdi-pencil" variant="text" @click="$emit('edit')">
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.edit')"></v-tooltip>
                </v-btn>
                <v-btn v-if="mode == 'select'" :icon="collapse ? 'mdi-chevron-down' : 'mdi-chevron-up'" variant="text" @click="collapse = !collapse"></v-btn>
            </div>
        </template>
        <template #description>
            <div v-show="!collapse">
                <div v-html="exercise.description"></div>
                <v-carousel @click.stop>
                    <v-carousel-item v-for="attachment in exercise.attachments" :key="attachment" :name="attachment" :src="$api.getAttachmentLink(attachment)">
                    </v-carousel-item>
                </v-carousel>
            </div>
                
        </template>
    </layout>
</template>

<script>
import { defineComponent } from 'vue';
// import { IExercise } from '@/interfaces'
import { useAuthenticationStore } from '@/plugins/pinia';
import { useAbility } from '@casl/vue';

import Layout from '@/components/Exercise/Layout.vue'
import { useI18n } from 'vue-i18n';
export default defineComponent({
    name: 'View',
    props: {
        exercise: {
            required: true,
            type: Object
        },
        mode: {
            type: String,
            default: 'edit'
        }
    },
    components: {
        Layout
    },
    setup() {
        const authStore = useAuthenticationStore();
        const { can } = useAbility();
        const { t } = useI18n(); 
        return {
            authStore,
            can,
            t
        }
    },
    data () {
        return {
            slide: this.exercise.attachments[0],
            collapse: this.mode !== 'edit'
        }
    },
    methods: {
        onCopy() {
            this.$api.copyExercise(this.exercise.id)
                .then(resp => this.$emit('copy', resp.data));
        }
    },
    watch: {
        exercise () {
            this.slide = this.exercise.attachments[0];
        }
    }
})
</script>
