<template>
    <v-row>
        <v-col>
            <edit-exercise :exercise="{}"></edit-exercise>
        </v-col>
        <v-col>
            <sharebility></sharebility>
        </v-col>
    </v-row>
</template>

<script>
import EditExercise from '../Exercise/Edit.vue';
import Sharebility from '../common/Sharebility.vue'
export default {
    setup() {
        
    },
    components: {
        EditExercise,
        Sharebility
    }
}
</script>
