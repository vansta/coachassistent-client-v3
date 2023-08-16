<template>
    <v-container>
        <v-card>
            <v-card-title>
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <v-text-field v-model="segment.name" :label="t('field.name')" :readonly="!(can('update', segment, 'name') || can('create', segment, 'name'))"></v-text-field>
                    </div>
                    <v-btn :disabled="!(can('update', segment, 'shareability') || can('create', segment, 'shareability'))" icon="mdi-cog" variant="text" @click="showSharebility = !showSharebility">
                        <v-icon>mdi-cog</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.shareability')"></v-tooltip>
                    </v-btn>
                    <v-btn :disabled="!(can('update', segment) || can('create', segment))" icon="mdi-content-save" variant="text" @click="save" :loading="loading.save">
                        <v-icon>mdi-content-save</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.save')"></v-tooltip>
                    </v-btn>
                    <v-btn v-if="segment.id" :disabled="!can('delete', segment)" icon="mdi-delete" color="negative" variant="text" @click="remove" :loading="loading.remove">
                        <v-icon>mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                    </v-btn>
                </div>
                
            </v-card-title>
            <v-card-text>
                <!-- <editor v-model="segment.description" api-key="no-api-key"/> -->
                <quill-editor v-if="(can('update', segment, 'description') || can('create', segment, 'description'))" v-model:content="segment.description" theme="snow" contentType="html"></quill-editor>
                <div v-else v-html="segment.description"></div>
            </v-card-text>
            <v-card-text v-if="showSharebility">
                <sharebility v-model="segment"></sharebility>
            </v-card-text>
        </v-card>
        <v-row>
            <v-col>
                <draggable v-model="segment.exercises" group="exercises" item-key="id">
                    <template #header>
                        <v-alert type="info" variant="tonal">
                            {{ t('drag_to') }}
                        </v-alert>
                        
                    </template>
                    <template #item="{ element }">
                        <exercise-view v-if="!element.edit" :exercise="element" mode="select" @edit="element.edit = true"></exercise-view>
                        <exercise-edit v-else :exercise="element" mode="select" @save="onSaveExercise(element)" @cancel="element.edit = false" :tags="tags"></exercise-edit>
                    </template>
                </draggable>
            </v-col>
            <v-col v-show="(can('update', segment) || can('create', segment))">
                <draggable v-model="exercises" group="exercises" item-key="id">
                    <template #header>
                        <v-alert variant="tonal">{{ t('drag_from') }}</v-alert>
                        <exercise-search @search="getExercises"></exercise-search>
                    </template>
                    <template #item="{ element }">
                        <exercise-view v-if="!element.edit" :exercise="element" mode="select" @edit="element.edit = true"></exercise-view>
                        <exercise-edit v-else :exercise="element" mode="select" @save="onSaveExercise(element)" @cancel="element.edit = false" :tags="tags"></exercise-edit>
                    </template>
                </draggable>
            </v-col>
        </v-row>

        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </v-container>
</template>

<script>
import ExerciseView from '@/components/Exercise/View.vue';
import ExerciseEdit from '@/components/Exercise/Edit.vue';
import ExerciseSearch from '@/components/Exercise/Search.vue';
import CDataIterator from '@/components/common/CDataIterator.vue'
import Editor from '@tinymce/tinymce-vue';
import Sharebility from '@/components/common/Sharebility.vue';
import Draggable from 'vuedraggable';

import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { useAbility } from '@casl/vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useI18n } from 'vue-i18n';
import { useConfirmDialog } from '@vueuse/core';

export default defineComponent({
    components: { ExerciseView, ExerciseEdit, ExerciseSearch, CDataIterator, Editor, Sharebility, Draggable },
    setup() {
        const toast = useToast();
        const { can } = useAbility();
        const authStore = useAuthenticationStore();
        const { t } = useI18n();
        const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();
        return { toast, can, authStore, t, isRevealed, reveal, confirm, cancel }
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
                editorIds: [this.authStore.user?.id],
                constructor: { modelName: 'shareable' },
                sharingLevel: '0'
            },
            exercises: [],
            tags: [],

            loading: {
                get: false,
                save: false,
                remove: false
            },
            splitterValue: 50,
            showSharebility: false
        }
    },
    methods: {
        getExercises (search) {
            this.loading.get = true;
            this.$api.getAllExercises(search)
                .then(resp => this.exercises = resp.data.items.filter(e => this.segment.exercises.findIndex(x => x.id === e.id) < 0))
                .finally(() => this.loading.get = false)
        },

        save () {
            this.loading.save = true;
            if (!this.segment.id) {
                this.$api.postSegment(this.segment)
                    .then(resp => {
                        this.segment.id = resp;
                        this.$router.push({ name: 'Segments' })
                    })
                    .catch(err => this.toast.error(err))
                    .finally(() => this.loading.save = false);
            }
            else {
                this.$api.putSegment(this.segment)
                    .then(() => {
                        this.$router.push({ name: 'Segments' })
                    })
                    .catch(err => this.toast.error(err))
                    .finally(() => this.loading.save = false);
            }
        },
        async remove () {
            const { data } = await this.reveal();
            if (data) {
                this.loading.remove = true;
                this.$api.deleteSegment(this.segment.id)
                .then(() => this.$router.push({ name: 'Segments' }))
                .finally(() => this.loading.remove = false);
            } 
        },
        onSaveExercise(exercise) {
            exercise.edit = false;
            this.getExercises();
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
        // availableExercises: {
        //     get() {
        //         return this.exercises.filter(e => this.segment.exercises.findIndex(x => x.id === e.id) < 0);
        //     },
        //     set(value) {
        //         this.segment.exercises = value;
        //         console.log(value);
        //         this.segment.exercises.push(value);
        //     }
        // }
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
