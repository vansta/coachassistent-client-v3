<template>
    <v-container>
        <v-card>
            <v-card-title>
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <v-text-field v-model="segment.name" label="Name" outlined dense></v-text-field>
                    </div>
                    <v-btn :disabled="!(can('update', segment, 'shareability') || can('create', segment, 'shareability'))" icon="mdi-cog" flat round @click="showSharebility = !showSharebility"></v-btn>
                    <v-btn :disabled="!(can('update', segment) || can('create', segment))" icon="mdi-content-save" flat @click="save"></v-btn>
                    <v-btn v-if="segment.id" :disabled="!can('delete', segment)" icon="mdi-delete" color="negative" flat round @click="remove"></v-btn>
                </div>
                
            </v-card-title>
            <v-card-text>
                <editor v-model="segment.description" api-key="no-api-key"/>
            </v-card-text>
            <v-card-text v-if="showSharebility">
                <sharebility v-model="segment"></sharebility>
            </v-card-text>
        </v-card>
        <v-row>
            <v-col>
                <div class="drop-zone" @drop="drop($event)" @dragover.prevent @dragenter.prevent>
                    <exercise-view v-for="exercise in segment.exercises" :key="exercise.id" class="q-ma-xs" :exercise="exercise"  :draggable="true" @dragstart="startToDrag($event, exercise)"></exercise-view>
                </div>
                
            </v-col>
            <v-col>
                <div class="drop-zone" @drop="drop($event, true)" @dragover.prevent @dragenter.prevent>
                <c-data-iterator :cols="12" :items="availableExercises">
                    <template #item="{ item }">
                        <exercise-view v-if="!item.edit" class="q-ma-xs" :exercise="item" :draggable="true" @dragstart="startToDrag($event, item)"></exercise-view>
                    </template>
                </c-data-iterator>
                
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ExerciseView from '@/components/Exercise/View.vue'
import CDataIterator from '@/components/common/CDataIterator.vue'
import Editor from '@tinymce/tinymce-vue';
import Sharebility from '@/components/common/Sharebility.vue';

import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { useAbility } from '@casl/vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';

export default defineComponent({
    components: { ExerciseView, CDataIterator, Editor, Sharebility },
    setup() {
        const toast = useToast();
        const { can } = useAbility();
        const authStore = useAuthenticationStore();
        return { toast, can, authStore }
    },
    created () {
        if (this.id) {
            this.$api.getSegment(this.id)
                .then((data) => this.segment = data)
        }
        this.getExercises();
    },
    props: {
        id: String
    },
    data () {
        return {
            segment: {
                id: '',
                name: '',
                description: '',
                exercises: [],
                editorIds: [this.authStore.user.id],
                constructor: { modelName: 'shareable' }
            },
            exercises: [],

            loading: false,
            splitterValue: 50,
            showSharebility: false
        }
    },
    methods: {
        getExercises () {
            this.loading = true;
            this.$api.getAllExercises()
                .then(resp => this.exercises = resp.data.items)
                .finally(() => this.loading = false)
        },

        save () {
            if (!this.segment.id) {
                this.$api.postSegment(this.segment)
                    .then(resp => {
                        this.segment.id = resp;
                        this.$router.push({ name: 'Segments' })
                    })
                    .catch(err => this.toast.error(err));
            }
            else {
                this.$api.putSegment(this.segment)
                    .then(() => {
                        this.$router.push({ name: 'Segments' })
                    })
                    .catch(err => this.toast.error(err));
            }
        },
        remove () {
            this.$api.deleteSegment((this.segment).id)
                .then(() => this.$router.push({ name: 'Segments' }));
        },

        startToDrag (evt, item) {
            if (evt.dataTransfer !== null) {
                evt.dataTransfer.dropEffect = 'link';
                evt.dataTransfer.effectAllowed = 'link';
                evt.dataTransfer.setData('id', item.id.toString())
            }
            
        },
        async drop (evt, remove) {
            const exerciseId = evt.dataTransfer?.getData('id');
            if (remove) {
                const index = this.segment.exercises.findIndex(e => e.id === exerciseId);
                this.segment.exercises.splice(index, 1);
            }
            else {
                const exercise = this.exercises.find(e => e.id === exerciseId);
                this.segment.exercises.push(exercise)
            }
            
        }
    },
    computed: {
        availableExercises () {
            if (this.exercises){
                return this.exercises.filter(e => this.segment.exercises.findIndex(x => x.id === e.id) < 0);
            }
            else {
                return [];
            }
        }
    }
})
</script>

<style scoped>
  .drop-zone {
    background-color: #eee;
    margin-bottom: 10px;
    padding: 10px;
    padding-bottom: 50px;
  }
  
</style>
