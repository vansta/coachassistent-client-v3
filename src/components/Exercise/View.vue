<template>
    <layout>
        <template #name>
            <div class="text-h6 text-left text-capitalize">{{ exercise.name }}</div>
        </template>
        <template #description>
                <div v-html="exercise.description"></div>
                <!-- <q-img :src="getImgSource(exercise.attachments[0])"/> -->
                <v-carousel @click.stop>
                    <v-carousel-item v-for="attachment in exercise.attachments" :key="attachment" :name="attachment" :src="getImgSource(attachment)">
                        <!-- <q-img :src="getImgSource(attachment)"/> -->
                    </v-carousel-item>
                </v-carousel>
        </template>
    </layout>
</template>

<script>
import { defineComponent, toRefs, ref, reactive, toRef } from 'vue'
// import { IExercise } from '@/interfaces'

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
    // setup(props) {
    //     const { exercise } = toRefs(props)
    //     var slide;
    //     if (exercise) {
    //         slide = ref(exercise.attachments[0]);
    //     } 
    //     return {
            
    //         slide
    //     }
    // },
    data () {
        return {
            slide: this.exercise.attachments[0]
        }
    },
    methods: {
        getImgSource(attachment) {
            if (attachment) {
                console.log('get attachment', attachment)
                return 'https://localhost:7210/api/' + attachment
            }
        }
    },
    watch: {
        exercise () {
            this.slide = this.exercise.attachments[0];
        }
    }
})
</script>
