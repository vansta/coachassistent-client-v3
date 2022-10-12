<template>
    <v-container>
        <v-card>
            <v-card-title>
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <v-text-field v-model="training.name" label="Name" outlined dense></v-text-field>
                    </div>
                    <v-btn icon="mdi-content-save" flat @click="save"></v-btn>
                </div>
                
            </v-card-title>
            <v-card-text>
                <editor v-model="training.description" api-key="no-api-key"/>
            </v-card-text>
        </v-card>
        <v-row>
            <v-col>
                <div class="drop-zone" @drop="drop($event)" @dragover.prevent @dragenter.prevent>
                    <exercise-view v-for="exercise in training.exercises" :key="exercise.id" class="q-ma-xs" :exercise="exercise"  :draggable="true" @dragstart="startToDrag($event, exercise)"></exercise-view>
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

import { defineComponent } from 'vue'

export default defineComponent({
    components: { ExerciseView, CDataIterator, Editor },
    setup() {
        return {}
    },
    created () {
        if (this.id) {
            this.$api.getTraining(this.id)
                .then((data) => this.training = data)
        }
        this.getExercises();
    },
    props: {
        id: String
    },
    data () {
        return {
            training: {
                description: '',
                exercises: []
            },
            exercises: [],

            loading: false,
            splitterValue: 50,
        }
    },
    methods: {
        getExercises () {
            this.loading = true;
            this.$api.getAllExercises()
                .then((data) => this.exercises = data.items)
                .finally(() => this.loading = false)
        },

        save () {
            if (!this.training.id) {
                this.$api.postTraining(this.training)
                    .then(resp => {
                        this.training.id = resp;
                    });
            }
            else {
                this.$api.putTraining(this.training);
            }
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
                const index = this.training.exercises.findIndex(e => e.id === exerciseId);
                this.training.exercises.splice(index, 1);
            }
            else {
                const exercise = this.exercises.find(e => e.id === exerciseId);
                this.training.exercises.push(exercise)
            }
            
        }
    },
    computed: {
        availableExercises () {
            return this.exercises.filter(e => this.training.exercises.findIndex(x => x.id === e.id) < 0);
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
