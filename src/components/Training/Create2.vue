<template>
    <v-container fluid>
        <v-card >
            <v-card-title>
                <v-text-field label="Title" v-model="training.name"></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-textarea label="Description"></v-textarea>
                    </v-col>
                </v-row>
                <!-- <v-row>
                    <v-col>
                        <v-file-input label="Attachments"></v-file-input>
                    </v-col>
                </v-row> -->
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
                <v-row no-gutters>
                    <v-col :cols="12">
                        <v-card v-for="(segment, index) in training.segments" :key="index">
                            <v-card-title>
                                <v-row>
                                    <v-col>
                                        {{ index + 1 }}
                                    </v-col>
                                    <v-col>
                                        <v-text-field label="Title"></v-text-field>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col>
                                        <v-btn icon variant="text" @click="segment.show = !segment.show">
                                            <v-icon v-if="segment.show">mdi-chevron-up</v-icon>
                                            <v-icon v-else>mdi-chevron-down</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                            <v-card-text v-if="segment.show">
                                <v-row>
                                    <v-col>
                                        <v-textarea></v-textarea>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-file-input></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-divider></v-divider>
                                <v-row>
                                    <v-col v-for="(exercise, index) in segment.exercises" :key="index" :cols="6">
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col>
                                                        {{ index + 1 }}
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field label="Title"></v-text-field>
                                                    </v-col>
                                                    <v-spacer></v-spacer>
                                                    <v-col>
                                                        <v-btn icon variant="text" @click="exercise.show = !exercise.show">
                                                            <v-icon v-if="exercise.show">mdi-chevron-up</v-icon>
                                                            <v-icon v-else>mdi-chevron-down</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-row>
                                                    <v-col>
                                                        <v-textarea label="Description"></v-textarea>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-carousel height="200"></v-carousel>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { reactive } from '@vue/reactivity'
export default {
    setup() {
        const training = reactive({
            segments: [
                {
                    exercises: [
                        {}
                    ]
                },
                {}
            ]
        });

        return {
            training
        }
    },
}
</script>