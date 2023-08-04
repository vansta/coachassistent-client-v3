<template>
    <layout>
        <template #name>
            <div class="d-flex">
                <div class="text-h6 text-left text-capitalize flex-grow-1">{{ exercise.name }}</div>
                <v-btn :disabled="!authStore.isAuthenticated" icon="mdi-content-copy" flat round @click="$emit('copy')"></v-btn>
                <v-btn :disabled="!authStore.isAuthenticated" icon="mdi-pencil" flat round @click="$emit('edit')"></v-btn>
            </div>
        </template>
        <template #description>
                <div v-html="exercise.description"></div>
                <!-- <q-img :src="getImgSource(exercise.attachments[0])"/> -->
                <v-carousel @click.stop>
                    <v-carousel-item v-for="attachment in exercise.attachments" :key="attachment" :name="attachment" :src="$api.getAttachmentLink(attachment)">
                        <!-- <q-img :src="getImgSource(attachment)"/> -->
                    </v-carousel-item>
                </v-carousel>
        </template>
    </layout>
</template>

<script>
import { defineComponent } from 'vue';
// import { IExercise } from '@/interfaces'
import { useAuthenticationStore } from '@/plugins/pinia';

import Layout from '@/components/Exercise/Layout.vue'
export default defineComponent({
    name: 'View',
    props: {
        exercise: {
            required: true,
            type: Object
        }
    },
    components: {
        Layout
    },
    setup() {
        const authStore = useAuthenticationStore();
        return {
            authStore
        }
    },
    data () {
        return {
            slide: this.exercise.attachments[0]
        }
    },
    methods: {
        
    },
    watch: {
        exercise () {
            this.slide = this.exercise.attachments[0];
        }
    }
})
</script>
