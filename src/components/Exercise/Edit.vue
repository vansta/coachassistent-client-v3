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
            <v-slide-group multiple v-model="editExercise.selectedAttachments" show-arrows :center-active="false">
                <v-slide-group-item v-for="attachment in editExercise.attachments" :key="attachment" v-slot="{ isSelected, toggle }" :value="attachment">
                    <v-img 
                        :src="$api.getAttachmentLink(attachment)" 
                        min-height="150" max-heigth="150" min-width="150" max-width="150" cover
                        @click="toggle">
                        <v-btn 
                            :icon="isSelected ? 'mdi-link-off' : 'mdi-link-plus'"
                            
                            variant="flat"
                            location="bottom left"
                            position="absolute"
                            :color="isSelected ? 'primary' : 'secondary'"
                            ></v-btn>
                    </v-img>
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
import { defineComponent, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import Layout from '@/components/Exercise/Layout.vue';
import Editor from '@tinymce/tinymce-vue';

export default defineComponent({
    name: 'Edit',
    props: {
        exercise: Object
    },
    components: {
        Layout,
        Editor
    },
    setup(props) {
        const editExercise = reactive({
            ...props.exercise, 
            selectedAttachments: props.exercise.attachments
        })
        const toast = useToast();

        return {
            editExercise, toast
        }
    },
    // created() {
    //     this.editExercise.selectedAttachments = this.exercise.attachments;
    // },
    // data () {
    //     return {
    //         editExercise: this.exercise
    //     }
    // },
    methods: {
        save () {
            if (!this.editExercise.id) {
                this.$api.postExercise(this.editExercise)
                    .then(resp => {
                        this.editExercise.id = resp;
                        this.$emit('save');
                    })
                    .catch(err => {
                        this.toast.error(err)
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
                    .catch(err => {
                        this.toast.error(err)
                    })
            }
            else {
                this.$emit('remove');
            }
        },

        getImgSource(attachment) {
            if (attachment) {
                return 'https://localhost:7210/api/' + attachment
            }
        }
    }
})
</script>
