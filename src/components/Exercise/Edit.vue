<template>
    <layout>
        <template #name>
            <div class="d-flex">
                <v-text-field class="flex-grow-1" v-model="editExercise.name" label="Name" variant="outlined" density="compact"></v-text-field>
                <v-btn icon="mdi-content-save" flat round @click="save"></v-btn>
                <v-btn icon="mdi-delete" color="negative" flat round @click="remove"></v-btn>
            </div>
            
            
        </template>
        <template #description>
            <editor v-model="editExercise.description" api-key="no-api-key"/>
            <!-- <v-textarea v-model="editExercise.description" height="50" label="Description"></v-textarea> -->
            <v-slide-group multiple v-model="editExercise.attachments">
                <v-slide-group-item v-for="attachment in editExercise.attachments" :key="attachment">
                    <v-img :src="getImgSource(attachment)" heigth="50" cover></v-img>
                </v-slide-group-item>
            </v-slide-group>
            <v-file-input outlined v-model="editExercise.addedAttachments" multiple>
                <template v-slot:prepend>
                    <v-icon>mdi-content-save</v-icon>
                </template>
            </v-file-input>
        </template>
    </layout>
</template>

<script>
import { defineComponent } from 'vue'

import Layout from '@/components/Exercise/Layout.vue';
import Editor from '@tinymce/tinymce-vue';

export default defineComponent({
    name: 'Edit',
    props: {
        exercise: {}
    },
    components: {
        Layout,
        Editor
    },
    setup() {
        return {
            
        }
    },
    data () {
        return {
            editExercise: this.exercise
        }
    },
    methods: {
        save () {
            if (!this.editExercise.id) {
                this.$api.postExercise(this.editExercise)
                    .then(resp => {
                        this.editExercise.id = resp;
                        this.$emit('save');
                    })
            }
            else {
                this.$api.putExercise(this.editExercise)
                    .then(() => this.$emit('save'))
            }
        },
        remove () {
            if (this.editExercise.id) {
                this.$api.deleteExercise(this.editExercise.id)
                    .then(() => this.$emit('remove'))
            }
            else {
                this.$emit('remove');
            }
        },

        getImgSource(attachment) {
            if (attachment) {
                console.log('get attachment', attachment)
                return 'https://localhost:7210/api/' + attachment
            }
        }
    }
})
</script>
